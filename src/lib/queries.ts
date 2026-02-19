import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

// --- KPIS ---
export function useKpis() {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_deals_board').select('*');
      if (error) throw error;

      const totalPipeline = data.reduce((acc, d) => acc + Number(d.value_cents), 0);
      const activeDeals = data.length;
      const overdueCount = data.filter((d) => d.sla_status === 'breached').length;

      return {
        totalPipeline: (totalPipeline / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        activeDeals,
        overdueCount,
        slaAvg: '12.4d', // Mock logic for average
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
      return data;
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
        .update({ stage_key: stageKey, updated_at: new Date().toISOString() })
        .eq('id', dealId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}
