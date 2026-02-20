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
  const { siteId, instruction, client_id } = await req.json()

  try {
    // 1. Get Current Site
    const { data: site } = await supabase.from('templeteria_sites').select('*').eq('id', siteId).single()
    if (!site) throw new Error("Site not found")

    // 2. Log Job
    const { data: job } = await supabase.from('templeteria_ai_jobs').insert({
      client_id, site_id: siteId, status: 'RUNNING', mode: 'REFINE', created_by: user.id,
      input_payload_json: { instruction, currentSchema: site.schema_json }
    }).select().single()
    jobId = job.id

    // 3. AI Call (Gemini)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY")

    const prompt = `Adjust this website JSON schema based on the instruction: "${instruction}".
    Current Schema: ${JSON.stringify(site.schema_json)}
    Return ONLY valid updated JSON schema.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const aiResult = await response.json()
    const textResponse = aiResult.candidates[0].content.parts[0].text
    const updated_schema = JSON.parse(textResponse.replace(/```json|```/g, ''))

    // 4. Update Site and Job
    await supabase.from('templeteria_sites').update({
       schema_json: updated_schema
    }).eq('id', siteId)

    await supabase.from('templeteria_ai_jobs').update({
      status: 'DONE', output_payload_json: updated_schema, provider: 'gemini'
    }).eq('id', jobId)

    return new Response(JSON.stringify({ schema: updated_schema }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    if (jobId) await supabase.from('templeteria_ai_jobs').update({ status: 'ERROR', error_message: err.message }).eq('id', jobId)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
