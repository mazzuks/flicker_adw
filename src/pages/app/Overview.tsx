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
 * 🏛️ ADWORKS DECISION PANEL (Final v6)
 * Precise reconstruction of "Performance por Responsável" based on file_67.
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
            </div>
          </Card>

          {/* 3. ATIVIDADE RECENTE */}
          <Card className="border border-slate-200 shadow-sm" noPadding>
            <CardHeader title="Atividade Recente" subtitle="Timeline Global de Operação" />
            <div className="p-4 divide-y divide-slate-50">
              {[
                { text: 'Processo #18 movido para LEAD', time: '4 minutos atrás', icon: Zap },
                {
                  text: 'Nova empresa cadastrada: Empresa Seed 20',
                  time: '25 minutos atrás',
                  icon: Building2,
                },
                {
                  text: 'SLA estourado: Empresa Seed 16',
                  time: '50 minutos atrás',
                  icon: AlertTriangle,
                },
              ].map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 px-2 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <act.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                      {act.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase italic">
                    {act.time}
                  </span>
                </div>
              ))}
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

          {/* PERFORMANCE POR RESPONSÁVEL (PIPEDRIVE RECONSTRUCTION) */}
          <Card className="border border-slate-200 shadow-sm" noPadding>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-widest italic">
                Performance por Responsável
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  name: 'Dan',
                  active: 20,
                  overdue: 10,
                  sla: '-0.7d',
                  img: 'https://i.pravatar.cc/150?u=dan',
                },
                {
                  name: 'Matheus',
                  active: 10,
                  overdue: 10,
                  sla: '0.7d',
                  img: 'https://i.pravatar.cc/150?u=math',
                },
                {
                  name: 'Sah AI',
                  active: 50,
                  overdue: 10,
                  sla: '-0.7d',
                  img: 'https://i.pravatar.cc/150?u=sah',
                },
              ].map((m, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.img}
                      className="w-8 h-8 rounded-full border border-slate-200 shadow-sm grayscale group-hover:grayscale-0 transition-all"
                    />
                    <span className="text-[13px] font-bold text-slate-700 tracking-tight">
                      {m.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[12px] font-bold text-slate-900 w-6 text-right">
                      {m.active}
                    </span>
                    <span className="text-[12px] font-bold text-red-500 w-6 text-right">
                      {m.overdue}
                    </span>
                    <span className="text-[12px] font-bold text-slate-400 w-12 text-right">
                      {m.sla}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
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
