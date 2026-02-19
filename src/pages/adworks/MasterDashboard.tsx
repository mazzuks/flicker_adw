import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Calendar,
  ChevronDown,
  Info,
  MousePointer2
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const DATA_WON = [
  { name: 'Set', val: 2400 }, { name: 'Out', val: 1398 }, { name: 'Nov', val: 9800 },
  { name: 'Dez', val: 3908 }, { name: 'Jan', val: 4800 }, { name: 'Fev', val: 7200 },
];

const DATA_PIPELINE = [
  { name: 'Leads', value: 400, color: '#3B82F6' },
  { name: 'Proposta', value: 300, color: '#8B5CF6' },
  { name: 'Negociação', value: 150, color: '#10B981' },
];

export function MasterDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto px-4 lg:px-8">
      {/* 🏛️ ENTERPRISE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-adworks-border">
        <div>
           <h1 className="text-2xl font-bold text-adworks-dark tracking-tight">Visão Geral do Negócio</h1>
           <p className="text-adworks-muted text-sm mt-1">Análise consolidada de performance e métricas comerciais.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center bg-adworks-surface border border-adworks-border rounded-lg px-3 py-1.5 shadow-adw-flat cursor-pointer hover:bg-adworks-accent transition-colors">
              <Calendar className="w-4 h-4 text-adworks-muted mr-2" />
              <span className="text-xs font-semibold text-adworks-dark">Fev 1, 2026 - Fev 28, 2026</span>
              <ChevronDown className="w-4 h-4 ml-2 text-adworks-muted" />
           </div>
           <button className="bg-adworks-blue text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 transition-all flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Ações Rápidas
           </button>
        </div>
      </div>

      {/* 💎 KPI HERO CARD (A3 Standard) */}
      <div className="bg-adworks-blue rounded-adw-lg p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
               <div className="flex items-center gap-2 mb-2 opacity-80">
                  <p className="text-[10px] font-black uppercase tracking-widest">Valor em Pipeline</p>
                  <Info className="w-3 h-3 cursor-help" />
               </div>
               <h3 className="text-4xl font-bold tracking-tight">R$ 5.240.800,00</h3>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                  <TrendingUp className="w-3 h-3 text-green-300" /> 
                  <span className="text-green-300">+12.5%</span> 
                  <span className="opacity-60 font-medium">vs último mês</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:border-l md:border-white/10 md:pl-12">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold italic">16.9%</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Deals</p>
                  <p className="text-2xl font-bold italic">1.6k</p>
               </div>
            </div>
         </div>
      </div>

      {/* 📊 SECONDARY KPI GRID (Neutral & Elegant) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Empresas Ativas', val: '1.240', delta: '+4%', icon: Users },
          { label: 'Ticket Médio', val: 'R$ 3.250', delta: '+R$ 150', icon: Target },
          { label: 'Tempo de Abertura', val: '12.5 dias', delta: '-1.2d', icon: Clock },
        ].map((item, i) => (
          <div key={i} className="bg-adworks-surface p-6 rounded-adw border border-adworks-border shadow-adw-card hover:border-adworks-blue/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-adworks-accent rounded-lg group-hover:bg-adworks-blue group-hover:text-white transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{item.delta}</span>
            </div>
            <p className="text-[10px] font-bold text-adworks-muted uppercase tracking-widest mt-4">{item.label}</p>
            <h4 className="text-2xl font-bold text-adworks-dark mt-1 tracking-tight">{item.val}</h4>
          </div>
        ))}
      </div>

      {/* 🚀 MAIN DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHART: REVENUE (Sophisticated) */}
        <div className="lg:col-span-8 bg-adworks-surface rounded-adw-lg p-8 border border-adworks-border shadow-adw-card">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-adworks-dark text-lg tracking-tight">Performance Histórica</h3>
              <div className="flex gap-4 text-[9px] font-black text-adworks-muted uppercase">
                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-adworks-blue"></div> Realizado</span>
              </div>
           </div>
           <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA_WON}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0047FF" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#0047FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="val" stroke="#0047FF" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" activeDot={{ r: 6, fill: '#0047FF', strokeWidth: 0 }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* ANALYTICS: PIPELINE */}
        <div className="lg:col-span-4 bg-adworks-surface rounded-adw-lg p-8 border border-adworks-border shadow-adw-card">
           <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest mb-8">Pipeline Stats</h3>
           <div className="h-[220px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={DATA_PIPELINE} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value">
                       {DATA_PIPELINE.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-[9px] font-black text-adworks-muted uppercase">Deals</p>
                 <p className="text-3xl font-black text-adworks-dark tracking-tighter">850</p>
              </div>
           </div>
           <div className="space-y-3 mt-8">
              {DATA_PIPELINE.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-adworks-accent rounded-xl border border-transparent hover:border-adworks-border transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-adworks-muted uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-adworks-dark">{item.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
