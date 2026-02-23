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

  const { siteName, businessType, tone, palette, sections, account_id } = await req.json()
  let jobId: string | null = null

  try {
    // 1. Initial Job Logging
    const { data: job } = await supabase.from('templeteria_ai_jobs').insert({
      status: 'running', 
      job_type: 'generate', 
      created_by: user.id,
      input_payload: { siteName, businessType, tone, palette, sections }
    }).select().single()
    jobId = job.id

    // 2. Real Gemini Call (Standard Contract)
    const API_KEY = Deno.env.get('GEMINI_API_KEY')
    const prompt = `Generate a modern business website schema for "${siteName}". 
    Type: ${businessType}. Tone: ${tone}. Colors: ${palette}.
    Required Sections: ${sections.join(', ')}.
    Return ONLY valid JSON in this structure:
    {
      "metadata": {"title": "...", "description": "..."},
      "theme": {"primaryColor": "...", "font": "Inter"},
      "pages": [{"id": "home", "blocks": [{"type": "hero", "props": {"headline": "...", "content": "...", "ctaText": "..."}}]}]
    }`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })

    const aiResult = await response.json()
    const rawText = aiResult.candidates[0].content.parts[0].text
    const schema = JSON.parse(rawText.replace(/```json|```/g, '').trim())

    // 3. Persistent Data Creation (Unified Schema)
    const slug = `${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(7)}`
    const { data: site } = await supabase.from('templeteria_sites').insert({
      account_id, created_by: user.id, name: siteName, slug, status: 'draft'
    }).select().single()

    const { data: version } = await supabase.from('templeteria_site_versions').insert({
      site_id: site.id, version: 1, schema_json: schema, created_by: user.id, notes: 'Initial AI generation'
    }).select().single()

    // 4. Update Job
    await supabase.from('templeteria_ai_jobs').update({
      status: 'done', output_payload: schema
    }).eq('id', jobId)

    return new Response(JSON.stringify({ siteId: site.id, slug, version: 1, schema }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    if (jobId) await supabase.from('templeteria_ai_jobs').update({ status: 'error', error_message: err.message }).eq('id', jobId)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
