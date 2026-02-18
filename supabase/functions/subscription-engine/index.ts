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

    const { clientId, planId } = await req.json()

    // 1. Buscar detalhes do plano
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError) throw planError

    // 2. Buscar dados do cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError) throw clientError

    // 🚀 LÓGICA DE INTEGRAÇÃO PAGBANK (Checkout Redirect)
    // Documentação Base: https://developer.pagbank.com.br/reference/criar-pedido
    
    const PAGBANK_TOKEN = Deno.env.get('PAGBANK_TOKEN')
    const PAGBANK_URL = Deno.env.get('PAGBANK_ENV') === 'production' 
      ? 'https://api.pagseguro.com/orders' 
      : 'https://sandbox.api.pagseguro.com/orders'

    // Simulação de payload para o PagBank
    const orderPayload = {
      reference_id: `SUB_${clientId}_${Date.now()}`,
      customer: {
        name: client.name,
        email: 'dan@adworks.solutions', // Ideal pegar do perfil
        tax_id: client.cnpj?.replace(/\D/g, '') || '00000000000',
        phones: [{ country: '55', area: '11', number: '999999999', type: 'MOBILE' }]
      },
      items: [
        {
          reference_id: plan.id,
          name: `Plano Adworks: ${plan.name}`,
          quantity: 1,
          unit_amount: Math.round(plan.price * 100) // PagBank usa centavos
        }
      ],
      notification_urls: [`${Deno.env.get('SUPABASE_URL')}/functions/v1/pagbank-webhook`],
      // Checkout Config
      checkout: {
        redirect_url: "https://adworks.app/client/account",
        skip_checkout_success_page: false
      }
    }

    console.log(`[PAGBANK] Gerando pedido para plano: ${plan.name}`)

    // Por enquanto, como o Dan está cadastrando, mantemos a simulação da URL
    // Assim que tiver o Token, basta descomentar o fetch real abaixo.
    
    /*
    const response = await fetch(PAGBANK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    })
    const pagbankData = await response.json()
    const checkoutUrl = pagbankData.links.find(l => l.rel === 'PAY')?.href
    */

    const checkoutUrl = `https://adworks.app/checkout/simulado/${clientId}_${planId}`

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: checkoutUrl,
        message: 'Aguardando configuração de chaves PagBank para processamento real.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
