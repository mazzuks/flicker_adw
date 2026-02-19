import React from 'react';
import { useKpis, useDealsBoard } from '../../lib/queries';
import { Card, KpiCard } from '../../components/ui/DashboardUI';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  AlertTriangle,
  ArrowRight,
  Zap,
  Building2,
  Clock,
  BarChart3,
  Users,
  History,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ ADWORKS DECISION PANEL (Final v5)
 * Restoring original aesthetic with improved readability.
 */

export function Overview() {
  const { data: kpis, isLoading: loadingKpis } = useKpis();
  const { data: deals, isLoading: loadingDeals } = useDealsBoard();
  const navigate = useNavigate();

  if (loadingKpis || loadingDeals)
    return (
      <div className="p-10 animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );

  const criticalDeals =
    deals
      ?.filter((d: any) => d.sla_status !== 'ok')
      .sort(
        (a: any, b: any) => new Date(a.sla_due_at).getTime() - new Date(b.sla_due_at).getTime()
      ) || [];

  const stages = [
    'LEAD',
    'CONTRATADO',
    'CNPJ',
    'DOMINIO',
    'EMAIL',
    'SITE',
    'MARCA',
    'CONTABILIDADE',
    'CONCLUIDO',
  ];

  const funnelStats = stages.map((s) => {
    const stageDeals = deals?.filter((d: any) => d.stage_key === s) || [];
    return {
      name: s,
      count: stageDeals.length,
      pct: deals?.length ? Math.round((stageDeals.length / deals.length) * 100) : 0,
    };
  });

  if (!deals || deals.length === 0) {
    return (
      <EmptyState
        title="Sem dados operacionais"
        description="Você ainda não possui processos ativos no sistema. Use o botão de Seed nas configurações para testar."
        icon={Zap}
        actionLabel="IR PARA CONFIGURAÇÕES"
        onAction={() => navigate('/app/settings')}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard label="Pipeline Total" value={kpis.totalPipeline} status="info" />
        <KpiCard label="Processos Ativos" value={kpis.activeDeals} status="success" />
        <KpiCard label="SLA Médio" value={kpis.slaAvg} status="info" />
        <KpiCard label="SLA Estourados" value={kpis.overdueCount} status="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. AÇÕES IMEDIATAS (SLA) - 7 COLS */}
        <div className="lg:col-span-7 space-y-6">
          <Card noPadding className="border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">
                Ações Imediatas (SLA)
              </h3>
              <Badge variant="danger">Atenção</Badge>
            </div>
            <div className="p-2 divide-y divide-slate-100">
              {criticalDeals.slice(0, 5).map((deal: any) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${deal.sla_status === 'breached' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                        {deal.company_name}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Etapa: {deal.stage_key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div
                      className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border ${deal.sla_status === 'breached' ? 'text-red-600 border-red-200 bg-red-100' : 'text-amber-600 border-amber-200 bg-amber-100'}`}
                    >
                      {deal.sla_status === 'breached' ? 'Atrasado' : 'Vence 24h'}
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate('/app/pipeline')}
                      className="px-6 py-2.5 h-auto text-[11px] font-bold uppercase tracking-widest shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
                    >
                      Abrir Processo
                    </Button>
                  </div>
                </div>
              ))}
              {criticalDeals.length === 0 && (
                <p className="p-10 text-center text-slate-400 text-xs italic font-medium">
                  Nenhum processo atrasado. Operação em dia! ✨
                </p>
              )}
            </div>
          </Card>

          {/* 3. PERFORMANCE / ATIVIDADE */}
          <Card className="border border-slate-200 shadow-sm" noPadding>
            <CardHeader title="Atividade Recente" subtitle="Timeline Global de Operação" />
            <div className="p-10 text-center opacity-60">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic">
                Aguardando novos eventos...
              </p>
            </div>
          </Card>
        </div>

        {/* 4. SIDEBAR - 5 COLS */}
        <div className="lg:col-span-5 space-y-8">
          {/* RESUMO DO FUNIL */}
          <Card className="border border-slate-200 shadow-sm" noPadding>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">
                Resumo do Funil
              </h3>
              <BarChart3 className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-6 space-y-5">
              {funnelStats.map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest leading-none">
                    <span className="text-slate-500">{s.name}</span>
                    <span className="text-slate-900">
                      {s.count} • {s.pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                    <div
                      className="bg-blue-600 h-full shadow-[0_0_8px_rgba(30,91,255,0.4)] transition-all duration-1000"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* PERFORMANCE POR RESPONSÁVEL (AESTHETIC RESTORED) */}
          <Card className="bg-white border border-slate-200 shadow-sm group">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-blue-600 text-xs uppercase tracking-[0.3em] italic">
                Performance / Time
              </h3>
            </div>
            <div className="p-6 space-y-8">
              {[
                { name: 'Matheus', deals: 12, overdue: 4, sla: '1.2d' },
                { name: 'Dan', deals: 5, overdue: 0, sla: '0.8d' },
                { name: 'Sah AI', deals: 2, overdue: 0, sla: '0.1d' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-50 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200 border border-blue-400/20">
                      {m.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[13px] font-bold tracking-tight text-slate-800 leading-none">
                        {m.name}
                      </p>
                      <div className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 uppercase tracking-widest inline-block leading-none">
                        {m.deals} DEALS ATIVOS
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${m.overdue > 0 ? 'text-red-500' : 'text-emerald-500'}`}
                    >
                      {m.overdue} Atrasos
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
                      Média {m.sla}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div>
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">{subtitle}</p>
        )}
      </div>
      <History className="w-4 h-4 text-slate-300" />
    </div>
  );
}
