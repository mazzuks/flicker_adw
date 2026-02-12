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

    // 1. Buscar guias DAS que vencem em 2 dias e não estão pagas
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const { data: overdueTickets } = await supabase
      .from('tickets')
      .select('*, client:clients(id, name)')
      .eq('type', 'TICKET_FISCAL')
      .eq('status', 'DONE') // DONE significa que a guia foi entregue mas talvez não paga
      .filter('data_json->>vencimento', 'eq', targetDateStr);

    console.log(`[FISCAL CRON] Encontradas ${overdueTickets?.length || 0} guias vencendo em 2 dias.`)

    for (const ticket of (overdueTickets || [])) {
      // 2. Criar notificação de alerta
      await supabase.from('notifications').insert({
        client_id: ticket.client_id,
        user_id: ticket.assigned_to, // Ou buscar via membership
        type: 'PAYMENT_INVOICE',
        title: '⚠️ Lembrete de Pagamento: DAS',
        body: `Sua guia do Simples Nacional vence em 48h (dia ${targetDateStr.split('-').reverse().join('/')}). Evite multas pagando agora via PIX no seu painel.`,
        entity_type: 'ticket',
        entity_id: ticket.id
      });
    }

    return new Response(
      JSON.stringify({ message: "Job fiscal concluído", processed: overdueTickets?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
