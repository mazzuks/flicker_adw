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

    // Simulação de agregação de dados real do banco
    // Em produção, aqui entrariam múltiplas queries SQL otimizadas
    
    const dashboardData = {
      period: { start: "2026-02-01", end: "2026-02-28", label: "Fevereiro 2026" },
      kpis: {
        pipeline_total: 5240800,
        weighted_value: 35600000,
        revenue_realized: 1200000,
        win_rate: 16.92,
        active_deals: 1600,
        avg_ticket: 3250,
        sla_avg_days: 12.5,
        deltas: { pipeline: 12.5, revenue: 8.2 }
      },
      alerts: {
        followups_overdue: 12,
        stale_deals_7d: 8,
        proposals_no_reply: 24,
        docs_pending: { cnpj: 5, accounting: 12, brand: 3, site: 2 },
        sla_at_risk: 3,
        items: [
          { type: "danger", label: "Follow-ups vencidos", count: 12, cta: "Ver agora", href: "/admin/tasks" },
          { type: "warning", label: "Negócios parados > 7 dias", count: 8, cta: "Reativar", href: "/admin/tasks" },
          { type: "danger", label: "SLA em risco iminente", count: 3, cta: "Priorizar", href: "/admin/tasks" }
        ]
      },
      actions: {
        tasks: [
          { due: "Hoje", title: "Aprovar Contrato Social", entity: "Restaurante S&A", owner: "Matheus", href: "/admin/tickets/cnpj" },
          { due: "14:30", title: "Enviar Guia DAS Jan", entity: "Clínica Sorriso", owner: "Sah", href: "/admin/tickets/fiscal" }
        ],
        messages: [
          { from: "Restaurante S&A", snippet: "Enviamos o protocolo...", status: "new", href: "/admin/messages" }
        ]
      },
      charts: {
        performance_series: [
          { x: "Set", y: 2400 }, { x: "Out", y: 3200 }, { x: "Nov", y: 2800 },
          { x: "Dez", y: 4500 }, { x: "Jan", y: 4200 }, { x: "Fev", y: 5800 }
        ],
        pipeline_distribution: [
          { stage: "Leads", value: 400, pct: 40.0 },
          { stage: "Proposta", value: 300, pct: 30.0 },
          { stage: "Negociação", value: 200, pct: 20.0 },
          { stage: "Ganho", value: 100, pct: 10.0 }
        ],
        cashflow_series: [
          { x: "01/02", planned: 50000, actual: 48000 },
          { x: "15/02", planned: 80000, actual: 72000 }
        ],
        stage_times: [
          { stage: "Triagem", avg_days: 2.5, conversion: 92.0 },
          { stage: "Junta", avg_days: 8.1, conversion: 85.0 },
          { stage: "Inscrição", avg_days: 1.4, conversion: 98.0 }
        ]
      },
      team: {
        online_count: 5,
        top_overdue_tasks: [{ user: "Matheus", count: 12 }],
        top_open_deals: [{ user: "Dan", count: 8 }],
        top_sla: [{ user: "Sah", avg_days: 0.1 }]
      }
    }

    return new Response(
      JSON.stringify(dashboardData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
