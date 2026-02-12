import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, clientId, planId } = await req.json()

    // SIMULAÇÃO DE LOGICA DE ASSINATURA (PAGBANK / MERCADO PAGO MOCK)
    let result = {}

    switch (action) {
      case 'create_checkout':
        // Simula criação de link de pagamento
        result = {
          checkout_url: `https://checkout.adworks.app/pay/${clientId}_${planId}`,
          expires_at: new Date(Date.now() + 86400000).toISOString()
        }
        break

      case 'sync_subscription':
        // Simula webhook de pagamento aprovado
        const { error: subError } = await supabase
          .from('subscriptions')
          .update({ status: 'ACTIVE', updated_at: new Date().toISOString() })
          .eq('client_id', clientId)

        if (subError) throw subError
        result = { status: 'success', message: 'Assinatura sincronizada' }
        break

      default:
        throw new Error('Ação não reconhecida')
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
