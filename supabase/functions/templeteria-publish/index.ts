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
    // 1. Ownership Validation
    const { data: site } = await supabase.from('templeteria_sites').select('*').eq('id', siteId).single()
    if (!site || site.created_by !== user.id) throw new Error("Unauthorized or project not found")

    // 2. Publish Update (Standardized)
    await supabase.from('templeteria_sites').update({
        status: 'published',
        published_version: version,
        updated_at: new Date().toISOString()
    }).eq('id', siteId)

    return new Response(JSON.stringify({ success: true, slug: site.slug }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
