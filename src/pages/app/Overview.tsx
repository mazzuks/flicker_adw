import { useKpis, useDealsBoard } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Building2,
  History,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * 🏛️ ADWORKS DECISION PANEL (Final v8 - Real-time Audit)
 * Reconstructing EXACT layout and aesthetics with real-time audit feed.
 */

export function Overview() {
  const { data: kpis, isLoading: loadingKpis } = useKpis();
  const { data: deals, isLoading: loadingDeals } = useDealsBoard();
  const navigate = useNavigate();
  
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);

  useEffect(() => {
    loadAuditEvents();
    
    // Optional: Real-time subscription for the audit feed
    const subscription = supabase
      .channel('realtime_audit')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events_audit' }, () => loadAuditEvents())
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, []);

  const loadAuditEvents = async () => {
    const { data } = await supabase
      .from('events_audit')
      .select('*, user_profiles:actor_id(full_name), deals:entity_id(title, company_name:companies(name))')
      .order('created_at', { ascending: false })
      .limit(6);
    
    setAuditEvents(data || []);
    setLoadingAudit(false);
  };

  if (loadingKpis || loadingDeals || loadingAudit)
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
    { key: 'Lead', label: 'Lead', count: 5, pct: 25, sla: '-2.1d' },
    { key: 'Contratado', label: 'Contratado', count: 4, pct: 20, sla: '-2.0d' },
    { key: 'CNPJ', label: 'CNPJ', count: 4, pct: 20, sla: '-1.7d' },
    { key: 'Dominio', label: 'Dominio', count: 4, pct: 20, sla: '-1.4d' },
    { key: 'Email', label: 'Email', count: 4, pct: 20, sla: '-2.9d' },
    { key: 'Site', label: 'Site', count: 4, pct: 20, sla: '-1.9d' },
    { key: 'Marca', label: 'Marca', count: 4, pct: 20, sla: '-2.0d' },
    { key: 'Contabilidade', label: 'Contabilidade', count: 1, pct: 5, sla: '2.0d' },
  ];

  return (
    <div className="p-4 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">OVERVIEW</h1>
      </div>

      {/* 1. KPI TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiItem label="PIPELINE TOTAL" value={kpis?.totalPipeline || 'R$ 0,00'} icon={Clock} color="text-blue-500" />
        <KpiItem label="PROCESSOS ATIVOS" value={String(kpis?.activeDeals || 0)} icon={Building2} color="text-slate-600" />
        <KpiItem label="SLA MÉDIO" value={kpis?.slaAvg || '0.0d'} icon={Clock} color="text-amber-500" />
        <KpiItem label="SLA ESTOURADOS" value={String(kpis?.overdueCount || 0)} icon={AlertTriangle} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* AÇÕES IMEDIATAS (SLA) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between bg-slate-50/30 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase italic">
                AÇÕES IMEDIATAS (SLA)
              </h3>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">
                ATENÇÃO
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {criticalDeals.slice(0, 5).map((row: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${row.sla_status === 'breached' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight italic">
                        {row.company_name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {row.stage_key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest italic ${row.sla_status === 'breached' ? 'text-red-500' : 'text-amber-500'}`}
                    >
                      {row.sla_status === 'breached' ? 'ATRASADO' : 'EM ALERTA'}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate('/app/pipeline')}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 h-auto text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Abrir Processo
                    </Button>
                  </div>
                </div>
              ))}
              {criticalDeals.length === 0 && <p className="p-10 text-center text-slate-400 text-[10px] font-bold uppercase italic tracking-widest">Nenhuma acao pendente no momento</p>}
            </div>
          </div>

          {/* PERFORMANCE EM TEMPO REAL (AUDIT FEED) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 bg-slate-50/30">
               <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase italic">
                 PERFORMANCE EM TEMPO REAL
               </h3>
             </div>
             <div className="divide-y divide-slate-50">
                {auditEvents.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="p-1.5 bg-slate-100 rounded text-slate-400"><History className="w-4 h-4" /></div>
                       <span className="text-[11px] font-bold text-slate-800">
                          <span className="text-slate-900">{act.user_profiles?.full_name?.split(' ')[0] || 'Sistema'}</span> 
                          <span className="text-slate-400 uppercase ml-2 tracking-tight">
                             {act.action === 'moved' 
                                ? `Moveu ${act.deals?.company_name?.name || 'Processo'} para ${act.payload_json?.to}` 
                                : `Criou novo processo: ${act.deals?.title}`}
                          </span>
                       </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                       {new Date(act.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {auditEvents.length === 0 && (
                   <div className="p-10 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase italic">Aguardando eventos operacionais...</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          {/* RESUMO DO FUNIL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase italic">
                RESUMO DO FUNIL
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 group transition-all"
                >
                  <div className="flex flex-col gap-2 w-full max-w-[120px]">
                    <span className="text-[11px] font-black text-slate-800 uppercase italic tracking-tight">{s.label}</span>
                    <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] font-black italic">
                    <span className="text-slate-900 w-4 text-right">{s.count}</span>
                    <span className="text-slate-400 w-8 text-right">{s.pct}%</span>
                    <span className="text-blue-500 w-12 text-right">{s.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiItem({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 bg-slate-50 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{value}</div>
    </div>
  );
}
