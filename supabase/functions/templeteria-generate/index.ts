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

  const { siteName, businessType, tone, palette, sections, client_id } = await req.json()
  let jobId: string | null = null

  try {
    // 1. Initial Job Logging
    const { data: job } = await supabase.from('templeteria_ai_jobs').insert({
      client_id, status: 'RUNNING', mode: 'GENERATE', created_by: user.id,
      input_payload_json: { siteName, businessType, tone, palette, sections }
    }).select().single()
    jobId = job.id

    // 2. Real Gemini Call
    const API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!API_KEY) throw new Error("GEMINI_API_KEY not configured")

    const prompt = `Generate a modern business website schema for "${siteName}". 
    Type: ${businessType}. Tone: ${tone}. Colors: ${palette}.
    Sections: ${sections.join(', ')}.
    Return ONLY valid JSON: 
    {
      "metadata": {"title": "...", "description": "..."},
      "theme": {"primaryColor": "...", "font": "Inter"},
      "pages": [{"id": "home", "blocks": [{"type": "hero", "props": {"headline": "...", "content": "...", "ctaText": "..."}}]}]
    }`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })

    const result = await response.json()
    const rawText = result.candidates[0].content.parts[0].text
    const schema = JSON.parse(rawText.replace(/```json|```/g, '').trim())

    // 3. Persistent Data Creation
    const slug = `${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(7)}`
    const { data: site } = await supabase.from('templeteria_sites').insert({
      client_id, created_by: user.id, name: siteName, slug, status: 'DRAFT'
    }).select().single()

    const { data: version } = await supabase.from('templeteria_site_versions').insert({
      site_id: site.id, client_id, version: 1, schema_json: schema, created_by: user.id, notes: 'Initial AI generation'
    }).select().single()

    // 4. Update Job
    await supabase.from('templeteria_ai_jobs').update({
      status: 'DONE', site_id: site.id, output_payload_json: schema, provider: 'gemini-1.5-flash'
    }).eq('id', jobId)

    return new Response(JSON.stringify({ siteId: site.id, slug, versionId: version.id, schema }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    if (jobId) await supabase.from('templeteria_ai_jobs').update({ status: 'ERROR', error_message: err.message }).eq('id', jobId)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
