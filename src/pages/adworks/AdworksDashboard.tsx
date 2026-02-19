import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Calendar,
  ChevronDown,
  Info,
  Filter,
  Activity,
  Zap,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * 🏛️ DECISION PANEL - REFOUNDATION 2.0
 */

export function AdworksDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Decision Panel</h1>
          <p className="text-slate-500 text-sm font-medium">
            Foco em execução e resolução de bloqueios operacionais.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/pipeline')}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3"
          >
            OPEN PIPELINE <ArrowRight className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🚨 BLOCKERS & SLA (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-red-600 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                SLA Breaches
              </p>
              <h4 className="text-4xl font-bold text-slate-900 tracking-tighter italic">14</h4>
              <div className="mt-4 flex items-center gap-1.5 text-red-600 font-black text-[9px] uppercase">
                <AlertTriangle className="w-3.5 h-3.5" /> Ação Requerida Imediata
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Blocked Processes
              </p>
              <h4 className="text-4xl font-bold text-slate-900 tracking-tighter italic">32</h4>
              <div className="mt-4 flex items-center gap-1.5 text-amber-600 font-black text-[9px] uppercase">
                <Clock className="w-3.5 h-3.5" /> Aguardando Cliente
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">
                Ações Recomendadas
              </h3>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: 'Reativar Negócios Parados > 7 dias', count: 8, target: 'Leads' },
                { label: 'Auditar Documentos Pendentes', count: 5, target: 'CNPJ' },
                { label: 'Processar Inscrições Municipais', count: 12, target: 'Accounting' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                      {item.label}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Gargalo na etapa: {item.target}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xl font-black text-slate-900">{item.count}</span>
                    <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 💰 MONEY & PERFORMANCE (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#0B1220] rounded-xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">
              Money Stalled by Stage
            </p>
            <div className="space-y-6">
              {[
                { stage: 'CNPJ', val: 'R$ 1.2M', perc: '45%' },
                { stage: 'Marca INPI', val: 'R$ 840k', perc: '25%' },
                { stage: 'Contábil', val: 'R$ 2.7M', perc: '70%' },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">{s.stage}</span>
                    <span className="text-blue-500 font-black">{s.val}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full shadow-[0_0_10px_#1e5bff]"
                      style={{ width: s.perc }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 italic">
              Pipeline Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-10">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Active Deals</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">1.6k</p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-8">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Revenue</p>
                <p className="text-3xl font-black text-blue-600 tracking-tighter italic">R$ 5.2M</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Avg. Ticket</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                  R$ 3.2k
                </p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-8">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Win Rate</p>
                <p className="text-3xl font-black text-emerald-600 tracking-tighter italic">
                  16.9%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
