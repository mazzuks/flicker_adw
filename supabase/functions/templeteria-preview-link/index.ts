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

  const { siteId } = await req.json()

  try {
    // 1. Verify Ownership
    const { data: site } = await supabase.from('templeteria_sites').select('*').eq('id', siteId).single()
    if (!site || site.created_by !== user.id) throw new Error("Unauthorized or project not found")

    // 2. Generate Token and Expiry (7 days)
    const preview_token = crypto.randomUUID()
    const preview_expires_at = new Date()
    preview_expires_at.setDate(preview_expires_at.getDate() + 7)

    // 3. Update Site record
    const { error: updateError } = await supabase.from('templeteria_sites').update({
        preview_token,
        preview_expires_at: preview_expires_at.toISOString()
    }).eq('id', siteId)

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, token: preview_token, slug: site.slug }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
