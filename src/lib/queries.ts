import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

// --- KPIS ---
export function useKpis() {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_deals_board').select('*');
      if (error) throw error;
      if (!data) return { totalPipeline: 'R$ 0,00', activeDeals: 0, overdueCount: 0, slaAvg: '0.0d' };

      const totalPipeline = data.reduce((acc, d) => acc + (d.value_cents || 0), 0);
      const activeDeals = data.length;
      const overdueCount = data.filter((d) => d.sla_status === 'breached').length;

      // --- SLA AVG REAL CALCULATION ---
      const now = new Date();
      const slaDeals = data.filter((d) => d.sla_due_at);
      let avgDays = 0;

      if (slaDeals.length > 0) {
        const totalDiffMs = slaDeals.reduce((acc, d) => {
          if (!d.sla_due_at) return acc;
          const due = new Date(d.sla_due_at);
          return acc + (due.getTime() - now.getTime());
        }, 0);
        avgDays = totalDiffMs / (1000 * 60 * 60 * 24) / slaDeals.length;
      }

      return {
        totalPipeline: (totalPipeline / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        activeDeals,
        overdueCount,
        slaAvg: `${avgDays.toFixed(1)}d`,
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
    },
  });
}
