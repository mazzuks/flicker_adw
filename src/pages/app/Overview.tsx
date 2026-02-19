import React from 'react';
import { useKpis, useDealsBoard } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AlertTriangle,
  Zap,
  Building2,
  BarChart3,
  History,
  ChevronRight,
  Clock,
  Info,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🏛️ ADWORKS DECISION PANEL (Final v7 - Absolute Fidelity)
 * Reconstructing EXACT layout and aesthetics from user-provided reference (file_59).
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">OVERVIEW</h1>
      </div>

      {/* 1. KPI TOP ROW - FIDELITY RECONSTRUCTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiItem label="PIPELINE TOTAL" value="R$ 56.200" icon={Clock} color="text-blue-500" />
        <KpiItem label="PROCESSOS ATIVOS" value="20" icon={Building2} color="text-slate-600" />
        <KpiItem label="SLA MÉDIO" value="-0.7d" icon={Clock} color="text-amber-500" />
        <KpiItem label="SLA ESTOURADOS" value="10" icon={AlertTriangle} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* AÇÕES IMEDIATAS (SLA) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                AÇÕES IMEDIATAS (SLA)
              </h3>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                ATENÇÃO
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { name: 'EMPRESA SEED 2', step: 'CNPJ', status: 'ATRASADO 2d', type: 'danger' },
                { name: 'EMPRESA SEED 3', step: 'DOMINIO', status: 'ATRASADO 2d', type: 'danger' },
                {
                  name: 'EMPRESA SEED 10',
                  step: 'CONTRATADO',
                  status: 'ATRASADO 1d',
                  type: 'danger',
                },
                { name: 'EMPRESA SEED 9', step: 'LEAD', status: 'Vence 1h', type: 'warning' },
                { name: 'EMPRESA SEED 4', step: 'EMAIL', status: 'Vence 2h', type: 'warning' },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${row.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                        {row.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {row.step}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${row.type === 'danger' ? 'text-red-500' : 'text-amber-500'}`}
                    >
                      {row.status}{' '}
                      {row.type === 'warning' && <ChevronRight className="inline w-3 h-3" />}
                    </span>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 h-auto text-[11px] font-bold uppercase tracking-widest"
                    >
                      Abrir Processo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50/50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 px-10">
              <span>TOTAL: 20</span>
              <span>100% • 20</span>
            </div>
          </div>

          {/* PERFORMANCE EM TEMPO REAL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                PERFORMANCE EM TEMPO REAL
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  name: 'Dan',
                  action: 'Processo #18 de CONTRATADO a CONCLUIDO',
                  time: '4 minutos atrás',
                },
                {
                  name: 'Dan',
                  action: '1 processo #9 DOMINIO 4 processos',
                  time: '25 minutos atrás',
                },
                {
                  name: 'Dan',
                  action: 'Processo #5 EMAIL estourados 30 mins atrás',
                  time: '30 minutos atrás',
                },
                { name: 'Dan', action: '4 firma EMPRESA SEED 5 a LEAD', time: '50 minutos atrás' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-400">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">
                      <span className="text-slate-900">Dan</span>{' '}
                      <span className="text-slate-400 uppercase ml-2 tracking-tight">
                        {act.action}
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          {/* RESUMO DO FUNIL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                RESUMO DO FUNIL
              </h3>
              <div className="flex gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <span>PROCESSOS</span>
                <span>O OU TOTAL</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 group"
                >
                  <div className="flex flex-col gap-1 w-full max-w-[120px]">
                    <span className="text-[12px] font-bold text-slate-800">{s.label}</span>
                    <div className="h-1 bg-slate-100 rounded-full w-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-[12px] font-bold">
                    <span className="text-slate-900 w-4 text-right">{s.count}</span>
                    <span className="text-slate-400 w-8 text-right">{s.pct}%</span>
                    <span className="text-blue-500 w-12 text-right">{s.sla}</span>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 px-6 bg-slate-50/50 text-[12px] font-bold">
                <span className="uppercase tracking-widest text-slate-900">TOTAL</span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-900 w-4 text-right">20</span>
                  <span className="text-slate-400 w-8 text-right">100%</span>
                  <span className="text-slate-400 w-12 text-right">2.0d</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE POR RESPONSÁVEL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                PERFORMANCE POR RESPONSÁVEL
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  name: 'Dan',
                  active: 20,
                  overdue: 10,
                  sla: '-0.7d',
                  img: 'https://i.pravatar.cc/150?u=dan',
                },
                {
                  name: 'Processo #5 CIKDO DEDINO',
                  active: 10,
                  overdue: 10,
                  sla: '0.7d',
                  icon: Users,
                },
                {
                  name: 'Processo #5 EMAIL',
                  sub: '50 min atrás',
                  active: 50,
                  overdue: 10,
                  sla: '-0.7d',
                  icon: History,
                },
                { name: 'EMPRESA SEED $ a LEAD', active: 1, sla: '1 hora', icon: Zap },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {m.img ? (
                      <img src={m.img} className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                        {m.icon && <m.icon className="w-4 h-4" />}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-800 tracking-tight">
                        {m.name}
                      </span>
                      {m.sub && (
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                          {m.sub}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-[12px] font-bold">
                    <span className="text-slate-900 w-4 text-right">{m.active}</span>
                    {m.overdue && <span className="text-red-500 w-4 text-right">{m.overdue}</span>}
                    <span className="text-slate-400 w-12 text-right">{m.sla}</span>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 bg-slate-50 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</div>
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
            {subtitle}
          </p>
        )}
      </div>
      <BarChart3 className="w-4 h-4 text-slate-200" />
    </div>
  );
}
