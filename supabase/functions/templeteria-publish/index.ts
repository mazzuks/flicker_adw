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

  const { siteId, version } = await req.json()

  try {
    // 1. Fetch the specific version data
    const { data: verData, error: verErr } = await supabase
      .from('templeteria_site_versions')
      .select('*')
      .eq('site_id', siteId)
      .eq('version', version)
      .single()

    if (verErr || !verData) throw new Error("Version not found")

    // 2. Ownership Validation
    const { data: site } = await supabase.from('templeteria_sites').select('*').eq('id', siteId).single()
    if (!site || site.created_by !== user.id) throw new Error("Unauthorized or project not found")

    // 3. Publish Update (Standardized Snapshot)
    const now = new Date().toISOString();
    const { error: updateError } = await supabase.from('templeteria_sites').update({
        status: 'published',
        published_version: verData.version,
        published_schema_json: verData.schema_json,
        published_schema_version: verData.schema_version,
        published_at: now
    }).eq('id', siteId)

    if (updateError) throw updateError;

    // 4. Log Publish Event (Audit)
    await supabase.from('templeteria_publish_events').insert({
       site_id: siteId,
       version_id: verData.id,
       published_by: user.id,
       published_at: now
    })

    // 5. Log General Job
    await supabase.from('templeteria_ai_jobs').insert({
       site_id: siteId,
       job_type: 'publish',
       status: 'done',
       created_by: user.id
    })

    return new Response(JSON.stringify({ success: true, slug: site.slug }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
