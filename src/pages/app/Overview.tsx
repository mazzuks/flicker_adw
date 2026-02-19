import React from 'react';
import { useKpis, useDealsBoard } from '../../lib/queries';
import { Card, KpiCard } from '../../components/ui/DashboardUI';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertTriangle, ArrowRight, Zap, Building2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Overview() {
  const { data: kpis, isLoading: loadingKpis } = useKpis();
  const { data: deals, isLoading: loadingDeals } = useDealsBoard();
  const navigate = useNavigate();

  if (loadingKpis || loadingDeals)
    return <div className="p-10 animate-pulse">Loading real-time data...</div>;

  const overdueDeals = deals?.filter((d: any) => d.sla_status === 'breached') || [];

  if (!deals || deals.length === 0) {
    return (
      <EmptyState
        title="Sem dados operacionais"
        description="Você ainda não possui processos ativos no sistema. Crie o primeiro para começar a monitorar."
        icon={Zap}
        actionLabel="CRIAR PRIMEIRO PROCESSO"
        onAction={() => navigate('/app/pipeline')}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard label="Pipeline Total" value={kpis.totalPipeline} status="info" />
        <KpiCard label="Processos Ativos" value={kpis.activeDeals} status="success" />
        <KpiCard label="SLA Médio" value={kpis.slaAvg} status="info" />
        <KpiCard label="SLA Estourado" value={kpis.overdueCount} status="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card noPadding>
            <div className="p-6 border-b border-[#E6E8EC] flex items-center justify-between">
              <h3 className="font-bold text-[#0B1220] text-xs uppercase tracking-widest">
                Ações Críticas (SLA)
              </h3>
              <Badge variant="danger">Urgente</Badge>
            </div>
            <div className="p-2 divide-y divide-[#E6E8EC]">
              {overdueDeals.slice(0, 5).map((deal: any) => (
                <div
                  key={deal.id}
                  onClick={() => navigate('/app/pipeline')}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-[#F7F8FA] rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0B1220] uppercase">
                        {deal.company_name}
                      </p>
                      <p className="text-[10px] font-black text-[#5B6475] uppercase tracking-widest mt-1">
                        Gargalo: {deal.stage_key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant="danger">ATRASADO</Badge>
                    <ArrowRight className="w-4 h-4 text-[#5B6475] group-hover:text-[#2563EB]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#0B1220] text-white">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Shortcuts</h3>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => navigate('/app/pipeline')}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-blue-600 transition-all group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Ver Pipeline
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-blue-600 transition-all group">
                <span className="text-[10px] font-bold uppercase tracking-widest">Abrir Inbox</span>
                <Badge variant="info">5 NOVAS</Badge>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
