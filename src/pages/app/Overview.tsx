import React from 'react';
import {
  ArrowRight,
  Clock,
  TrendingUp,
  Zap,
  AlertTriangle,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { KpiCard, Card } from '../../components/ui/DashboardUI';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function Overview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🏁 SECTION 1: CORE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard label="Pipeline Total" value="R$ 5.2M" delta="+12%" status="info" />
        <KpiCard label="Deals Ativos" value="1.624" delta="+5" status="success" />
        <KpiCard label="SLA Médio" value="12.5 d" delta="-1.2d" status="danger" />
        <KpiCard label="Conversão" value="16.9%" delta="Stable" status="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🚨 SECTION 2: AT RISK / OVERDUE (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card noPadding>
            <div className="p-6 border-b border-[#E6E8EC] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1220] uppercase tracking-widest leading-none">
                  Processos em Risco
                </h3>
                <p className="text-[10px] text-[#5B6475] font-medium mt-2 uppercase tracking-tighter">
                  SLA Vencendo ou Atrasado
                </p>
              </div>
              <Badge variant="danger">Ação Imediata</Badge>
            </div>
            <div className="p-2 divide-y divide-[#E6E8EC]">
              {[
                { company: 'Restaurante Sabor & Arte', stage: 'CNPJ', sla: '-2d', type: 'danger' },
                { company: 'Clínica Sorriso', stage: 'Domínio', sla: '8h', type: 'warning' },
                { company: 'Dona Helena Doces', stage: 'Marca', sla: '-5d', type: 'danger' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-[#F7F8FA] rounded-xl flex items-center justify-center text-[#5B6475] group-hover:text-[#2563EB] transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0B1220] uppercase">{item.company}</p>
                      <p className="text-[10px] font-black text-[#5B6475] uppercase tracking-widest mt-1">
                        Etapa: {item.stage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div
                      className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-md border ${item.type === 'danger' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}
                    >
                      SLA {item.sla}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5B6475] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-[9px] font-black text-[#5B6475] hover:text-[#2563EB] border-t border-[#E6E8EC] uppercase tracking-[0.2em]">
              Ver todos os bloqueios
            </button>
          </Card>
        </div>

        {/* ⚡ SECTION 3: SHORTCUTS (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#0B1220] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all" />
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 italic">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#2563EB] hover:border-[#2563EB] transition-all flex flex-col items-center gap-2 group/btn">
                  <Plus className="w-5 h-5 text-[#2563EB] group-hover/btn:text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 group-hover/btn:text-white">
                    Novo Processo
                  </span>
                </button>
                <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#2563EB] hover:border-[#2563EB] transition-all flex flex-col items-center gap-2 group/btn">
                  <Zap className="w-5 h-5 text-[#2563EB] group-hover/btn:text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 group-hover/btn:text-white">
                    Abrir Inbox
                  </span>
                </button>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col h-full bg-white">
            <h3 className="text-[10px] font-black text-[#5B6475] uppercase tracking-[0.3em] mb-6">
              Próximos Passos
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Completar Site Builder', entity: 'Restaurante S&A' },
                { label: 'Validar INSS Mensal', entity: 'Clínica Sorriso' },
              ].map((t, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full mt-2 group-hover:scale-150 transition-transform" />
                  <div>
                    <p className="text-sm font-bold text-[#0B1220] leading-tight">{t.label}</p>
                    <p className="text-[10px] font-medium text-[#5B6475] uppercase mt-1">
                      {t.entity}
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
