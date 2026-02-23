import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

// --- KPIS (Backend Driven) ---
export function useKpis() {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_dashboard_stats').select('*').maybeSingle();
      if (error) throw error;
      
      if (!data) return { 
        totalPipeline: 'R$ 0,00', 
        activeDeals: 0, 
        overdueCount: 0, 
        slaAvg: '0.0d' 
      };

      return {
        totalPipeline: (data.total_pipeline_cents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        activeDeals: data.active_deals,
        overdueCount: data.overdue_count,
        slaAvg: `${data.sla_avg_days.toFixed(1)}d`,
      };
    },
  });
}

// --- PIPELINE / DEALS ---
export function useDealsBoard() {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_deals_board').select('*');
      if (error) throw error;
      return data || [];
    },
  });
}

// --- MUTATIONS ---
export function useMoveDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ dealId, stageKey }: { dealId: string; stageKey: string }) => {
      const { error } = await supabase
        .from('deals')
        .update({ stage_key: stageKey })
        .eq('id', dealId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] }); // Also refresh KPIs
    },
  });
}
