import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, body, template_data } = await req.json()

    // TODO: Integrar com provedor real (Resend/SendGrid)
    // Exemplo Resend:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ from: 'Adworks <noreply@adworks.app>', to: [to], subject, html: body })
    // })

    console.log(`[SIMULAÇÃO EMAIL] Para: ${to} | Assunto: ${subject}`)
    console.log(`Conteúdo: ${body}`)

    return new Response(
      JSON.stringify({ message: "Email simulation successful", sent_to: to }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
