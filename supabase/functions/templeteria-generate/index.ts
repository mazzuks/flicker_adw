import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const authHeader = req.headers.get('Authorization')!
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  
  if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })

  let jobId: string | null = null;
  const { siteName, businessType, tone, palette, sections, client_id } = await req.json()

  try {
    // 1. Rate Limit (10 per day)
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('templeteria_ai_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .eq('mode', 'GENERATE')
      .gte('created_at', today)

    if (count && count >= 10) return new Response(JSON.stringify({ error: 'Daily limit reached' }), { status: 429, headers: corsHeaders })

    // 2. Log Initial Job
    const { data: job } = await supabase.from('templeteria_ai_jobs').insert({
      client_id, status: 'RUNNING', mode: 'GENERATE', created_by: user.id,
      input_payload_json: { siteName, businessType, tone, palette, sections }
    }).select().single()
    jobId = job.id

    // 3. AI Generation (Gemini)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY env")

    const prompt = `Generate a modern business website JSON schema for:
    Name: ${siteName}
    Business: ${businessType}
    Tone: ${tone}
    Color Palette: ${palette}
    Include sections: ${sections.join(', ')}
    
    Return ONLY valid JSON:
    {
      "metadata": {"title": "...", "description": "..."},
      "theme": {"primaryColor": "...", "font": "Inter"},
      "pages": [{"id": "home", "blocks": [{"type": "hero", "props": {"headline": "...", "content": "...", "ctaText": "..."}}]}]
    }`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const result = await response.json()
    const text = result.candidates[0].content.parts[0].text
    const schema_json = JSON.parse(text.replace(/```json|```/g, ''))

    // 4. Persistence
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(7)
    const { data: site } = await supabase.from('templeteria_sites').insert({
      client_id, created_by: user.id, slug, title: siteName, schema_json, status: 'DRAFT'
    }).select().single()

    await supabase.from('templeteria_ai_jobs').update({
      status: 'DONE', site_id: site.id, output_payload_json: schema_json, provider: 'gemini'
    }).eq('id', jobId)

    return new Response(JSON.stringify({ siteId: site.id, slug, schema: schema_json }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    if (jobId) await supabase.from('templeteria_ai_jobs').update({ status: 'ERROR', error_message: err.message }).eq('id', jobId)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
