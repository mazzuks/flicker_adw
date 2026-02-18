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

    const { clientId } = await req.json()

    // 1. Coletar TODOS os dados de onboarding do cliente
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('client_id', clientId)

    if (stepsError) throw stepsError

    // 2. Coletar dados básicos da empresa
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError) throw clientError

    // 3. Gerar o Dossiê Estruturado (Dossier JSON de Engenharia)
    const dossier = {
      generated_at: new Date().toISOString(),
      company: {
        id: client.id,
        name: client.name,
        fantasy_name: client.fantasy_name,
        slug: client.slug
      },
      data: steps.reduce((acc, step) => {
        acc[step.step_key] = step.data_json;
        return acc;
      }, {})
    }

    // 4. Criar o Ticket de Abertura de CNPJ com prioridade URGENT
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        client_id: clientId,
        type: 'TICKET_CNPJ',
        status: 'NEW',
        priority: 'URGENT',
        data_json: dossier, // Injeta o dossiê completo no ticket
        sla_due_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 dias
      })
      .select()
      .single()

    if (ticketError) throw ticketError

    // 5. Notificar a equipe Adworks e o Cliente
    await supabase.from('notifications').insert([
      {
        client_id: clientId,
        type: 'STATUS_CHANGED',
        title: '🚀 Processo de CNPJ Iniciado!',
        body: 'Seu onboarding foi concluído com sucesso. Nossa equipe já gerou o seu dossiê e iniciou a abertura do seu CNPJ.',
        entity_type: 'onboarding'
      }
    ])

    console.log(`[AUTOMATION] Dossiê gerado e Ticket criado para cliente: ${clientId}`)

    return new Response(
      JSON.stringify({ success: true, ticketId: ticket.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
