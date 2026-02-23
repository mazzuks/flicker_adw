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

  const { siteId, instruction, account_id } = await req.json()
  let jobId: string | null = null

  try {
    // 1. Fetch current schema
    const { data: lastVer } = await supabase.from('templeteria_site_versions')
      .select('*').eq('site_id', siteId).order('version', { ascending: false }).limit(1).single()
    
    if (!lastVer) throw new Error("Current schema version not found")

    // 2. Log Job
    const { data: job } = await supabase.from('templeteria_ai_jobs').insert({
      site_id: siteId, status: 'running', job_type: 'refine', created_by: user.id,
      prompt: instruction
    }).select().single()
    jobId = job.id

    // 3. AI Refinement
    const API_KEY = Deno.env.get('GEMINI_API_KEY')
    const prompt = `Refine the following website schema according to: "${instruction}".
    Current Schema: ${JSON.stringify(lastVer.schema_json)}
    Return ONLY valid updated JSON schema.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })

    const result = await response.json()
    const updatedSchema = JSON.parse(result.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim())

    // 4. Create New Version
    const { data: nextVer } = await supabase.from('templeteria_site_versions').insert({
      site_id: siteId, version: lastVer.version + 1, schema_json: updatedSchema, created_by: user.id, notes: 'AI Refinement'
    }).select().single()

    // 5. Finalize Job
    await supabase.from('templeteria_ai_jobs').update({
      status: 'done', version_id: nextVer.id, result_json: updatedSchema, provider: 'gemini-1.5-flash'
    }).eq('id', jobId)

    return new Response(JSON.stringify({ schema: updatedSchema, versionId: nextVer.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    if (jobId) await supabase.from('templeteria_ai_jobs').update({ status: 'error', error: err.message }).eq('id', jobId)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
