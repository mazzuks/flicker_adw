import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { domain } = await req.json()
    if (!domain) throw new Error('Domínio é obrigatório')

    // LÓGICA REAL: Registro.br usa RDAP para consultas
    // Endpoint: https://rdap.registro.br/domain/dominio.com.br
    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0]
    
    console.log(`🔍 Consultando disponibilidade: ${cleanDomain}`)
    
    const response = await fetch(`https://rdap.registro.br/domain/${cleanDomain}`)
    
    let isAvailable = false
    
    if (response.status === 404) {
      isAvailable = true // RDAP retorna 404 quando o objeto não existe (está disponível)
    } else if (response.status === 200) {
      isAvailable = false // RDAP retorna 200 quando o domínio já tem dono
    } else {
      throw new Error(`Erro na API do Registro.br: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ 
        domain: cleanDomain,
        available: isAvailable,
        timestamp: new Date().toISOString()
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
