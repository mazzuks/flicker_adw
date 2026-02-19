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
 * 🏛️ ADWORKS DECISION PANEL (Final v4)
 * Fixing contrast and visibility based on file_64/65
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
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">
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
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
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
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">
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

          {/* PERFORMANCE POR RESPONSÁVEL (HI-CONTRAST) */}
          <Card className="bg-slate-900 text-white shadow-xl relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 p-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-blue-400 italic">
                Performance / Time
              </h3>
              <div className="space-y-6">
                {[
                  { name: 'Matheus', deals: 12, overdue: 4, sla: '1.2d' },
                  { name: 'Dan', deals: 5, overdue: 0, sla: '0.8d' },
                  { name: 'Sah AI', deals: 2, overdue: 0, sla: '0.1d' },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg border border-blue-400/30">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[15px] font-black tracking-tight text-white leading-none uppercase">
                          {m.name}
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-[10px] font-black text-blue-300 uppercase tracking-widest">
                          {m.deals} DEALS ATIVOS
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-black uppercase tracking-widest ${m.overdue > 0 ? 'text-red-400' : 'text-emerald-400'}`}
                      >
                        {m.overdue} Atrasos
                      </p>
                      <p className="text-[10px] font-bold text-white/40 uppercase mt-1.5 tracking-tighter">
                        Média {m.sla}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{subtitle}</p>
        )}
      </div>
      <History className="w-4 h-4 text-slate-300" />
    </div>
  );
}
