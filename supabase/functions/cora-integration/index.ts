import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { action, clientId, data } = await req.json()

    // SIMULAÇÃO DA API DA CORA
    // Em produção: substituir por fetch('https://api.cora.com.br/v1/...')
    
    let responseData = {}
    
    switch(action) {
      case 'check_account_status':
        responseData = { 
          status: 'APPROVED', 
          accountNumber: '12345-6', 
          branch: '0001',
          message: 'Conta ativa e pronta para uso.'
        }
        break
      case 'generate_onboarding_link':
        responseData = { 
          url: `https://cora.com.br/onboarding?ref=${clientId}`,
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
        break
      default:
        throw new Error('Ação inválida')
    }

    console.log(`[CORA MOCK] Ação: ${action} para Cliente: ${clientId}`)

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
