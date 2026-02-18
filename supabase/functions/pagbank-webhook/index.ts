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

    const payload = await req.json()
    console.log('[PAGBANK WEBHOOK] Recebido:', payload)

    // LÓGICA DE PROCESSAMENTO DO WEBHOOK
    // Referência: https://developer.pagbank.com.br/reference/notificacoes
    
    const referenceId = payload.reference_id // Ex: SUB_ID-CLIENTE_TIMESTAMP
    const status = payload.status // PAID, DECLINED, CANCELED

    if (status === 'PAID' && referenceId) {
      const clientId = referenceId.split('_')[1]

      // 1. Atualizar assinatura para ACTIVE
      const { error: subError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'ACTIVE', 
          updated_at: new Date().toISOString(),
          current_period_start: new Date().toISOString()
        })
        .eq('client_id', clientId)

      if (subError) throw subError

      // 2. Criar registro de pagamento
      await supabase.from('payments').insert({
        client_id: clientId,
        amount: payload.amounts?.value / 100 || 0,
        status: 'PAID',
        payment_method: payload.payment_method?.type || 'UNKNOWN',
        external_reference: payload.id
      })

      // 3. Notificar o cliente
      await supabase.from('notifications').insert({
        client_id: clientId,
        type: 'STATUS_CHANGED',
        title: '✅ Assinatura Ativada!',
        body: 'Seu pagamento foi processado com sucesso. Bem-vindo ao plano Pro!',
        entity_type: 'subscription'
      })
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
