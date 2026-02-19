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
  MousePointer2,
  Filter,
  Search,
  Command
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

export function MasterDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      {/* 🏛️ ENTERPRISE TOPBAR (A3 Standard) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-adworks-border">
        <div className="space-y-1">
           <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none">Command Center</h1>
           <p className="text-adworks-muted text-sm font-medium">Relatórios e inteligência de mercado em tempo real.</p>
        </div>

        <div className="flex items-center gap-4">
           {/* Global Search / Command Palette Shortcut */}
           <div className="hidden md:flex items-center bg-adworks-accent border border-adworks-border rounded-xl px-4 py-2 text-adworks-muted gap-3 hover:border-adworks-blue/30 transition-all cursor-text w-64">
              <Search className="w-4 h-4" />
              <span className="text-xs font-semibold flex-1 text-left">Busca Global...</span>
              <kbd className="bg-white border border-adworks-border rounded px-1.5 py-0.5 text-[9px] font-black tracking-tighter">⌘K</kbd>
           </div>
           
           <div className="flex items-center bg-adworks-surface border border-adworks-border rounded-xl px-4 py-2 shadow-adw-flat cursor-pointer hover:bg-adworks-accent transition-colors">
              <Calendar className="w-4 h-4 text-adworks-muted mr-3" />
              <span className="text-xs font-bold text-adworks-dark uppercase tracking-wider">Fevereiro / 2026</span>
              <ChevronDown className="w-4 h-4 ml-3 text-adworks-muted" />
           </div>
        </div>
      </div>

      {/* 💎 KPI HERO: PIPELINE VALUE (Visual Focal Point) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-adworks-blue rounded-adw-lg p-10 text-white shadow-2xl shadow-blue-500/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl opacity-50" />
           <div className="relative z-10">
              <div className="flex items-start justify-between mb-10">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 text-blue-200">Pipeline Financeiro Global</p>
                    <h3 className="text-5xl font-bold tracking-tighter leading-none italic">R$ 5.240.800,00</h3>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                 </div>
              </div>

              <div className="flex flex-wrap gap-8 items-center pt-10 border-t border-white/10">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold italic tracking-tight">16.92%</p>
                 </div>
                 <div className="w-px h-10 bg-white/10 hidden sm:block" />
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-1">Active Deals</p>
                    <p className="text-2xl font-bold italic tracking-tight">1.6k</p>
                 </div>
                 <div className="w-px h-10 bg-white/10 hidden sm:block" />
                 <button className="ml-auto bg-white text-adworks-blue px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                    Análise Detalhada
                 </button>
              </div>
           </div>
        </div>

        {/* SECONDARY STATS (Vertical Stack) */}
        <div className="space-y-6">
           <div className="bg-adworks-surface p-8 rounded-adw-lg border border-adworks-border shadow-adw-flat hover:border-adworks-blue/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">Ticket Médio</p>
                 <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="text-3xl font-bold text-adworks-dark tracking-tighter">R$ 3.250</h4>
              <p className="text-[9px] font-bold text-green-600 uppercase mt-2">+R$ 150 vs último mês</p>
           </div>
           <div className="bg-adworks-surface p-8 rounded-adw-lg border border-adworks-border shadow-adw-flat hover:border-adworks-blue/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">SLA de Entrega</p>
                 <Clock className="w-4 h-4 text-adworks-blue" />
              </div>
              <h4 className="text-3xl font-bold text-adworks-dark tracking-tighter">12.5 dias</h4>
              <p className="text-[9px] font-bold text-adworks-blue uppercase mt-2">-1.2 dias de média</p>
           </div>
        </div>
      </div>

      {/* 🚀 CHART AREA: SOPHISTICATED PERFORMANCE */}
      <div className="bg-adworks-surface rounded-adw-lg p-10 border border-adworks-border shadow-adw-flat">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-xl font-bold text-adworks-dark tracking-tight uppercase italic leading-none">Fluxo de Performance Histórica</h3>
               <p className="text-adworks-muted text-[10px] font-black uppercase tracking-[0.2em] mt-3">Análise de Receita Ganhos - 12 Meses</p>
            </div>
            <div className="flex bg-adworks-accent p-1 rounded-xl">
               {['Mês', 'Semana', 'Dia'].map(t => (
                 <button key={t} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm' : 'text-adworks-muted hover:text-adworks-dark'}`}>{t}</button>
               ))}
            </div>
         </div>
         <div className="h-[380px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA_WON}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0047FF" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#0047FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} dy={12} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px'}}
                    itemStyle={{fontWeight: '900', textTransform: 'uppercase', fontSize: '10px'}}
                  />
                  <Area type="monotone" dataKey="val" stroke="#0047FF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" activeDot={{ r: 8, fill: '#0047FF', strokeWidth: 4, stroke: '#fff' }} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
}
