import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })

    const { siteId, currentTemplate, instruction, scope, targetId, client_id } = await req.json()

    // 1. Rate Limit
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('templeteria_ai_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .eq('mode', 'REFINE')
      .gte('created_at', today)

    const limit = parseInt(Deno.env.get('TEMPLETERIA_REFINE_DAILY_LIMIT') ?? '30')
    if (count && count >= limit) {
      return new Response(JSON.stringify({ error: 'Daily limit reached' }), { status: 429, headers: corsHeaders })
    }

    // 2. Insert job
    const { data: job } = await supabase
      .from('templeteria_ai_jobs')
      .insert({
        client_id,
        site_id: siteId,
        status: 'RUNNING',
        mode: 'REFINE',
        input_payload_json: { instruction, scope, targetId },
        created_by: user.id
      })
      .select()
      .single()

    // 3. AI logic (Refine template)
    // Stub implementation to ensure closure without external key dependency in this step
    const template = { ...currentTemplate }
    if (scope === 'GLOBAL' && instruction.toLowerCase().includes('color')) {
      template.theme.palette = 'refined'
    }

    // 4. Update job
    await supabase
      .from('templeteria_ai_jobs')
      .update({
        status: 'DONE',
        output_payload_json: { template },
        provider: 'local-stub'
      })
      .eq('id', job.id)

    return new Response(JSON.stringify({ template }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
