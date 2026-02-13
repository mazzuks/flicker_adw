import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Filter,
  Calendar,
  ChevronDown,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
  { name: 'Mai 2024', val: 400 },
  { name: 'Jun 2024', val: 500 },
  { name: 'Jul 2024', val: 450 },
  { name: 'Ago 2024', val: 600 },
  { name: 'Set 2024', val: 780 },
  { name: 'Out 2024', val: 720 },
  { name: 'Nov 2024', val: 850 },
  { name: 'Dez 2024', val: 680 },
  { name: 'Jan 2025', val: 920 },
  { name: 'Fev 2025', val: 880 },
  { name: 'Mar 2025', val: 980 },
  { name: 'Abr 2025', val: 1050 },
];

const DATA_PROJECTION = [
  { name: 'Mai 2025', val: 1100 },
  { name: 'Jun 2025', val: 1150 },
  { name: 'Jul 2025', val: 1200 },
  { name: 'Ago 2025', val: 1250 },
  { name: 'Set 2025', val: 1300 },
  { name: 'Out 2025', val: 1350 },
  { name: 'Nov 2025', val: 1400 },
  { name: 'Dez 2025', val: 1450 },
  { name: 'Jan 2026', val: 1500 },
  { name: 'Fev 2026', val: 1550 },
  { name: 'Mar 2026', val: 1600 },
  { name: 'Abr 2026', val: 1650 },
];

const COLORS = ['#0047FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export function MasterDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-1000 pb-20">
      {/* 🏁 PIPEDRIVE KPI HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vendas Totais</p>
              <h3 className="text-2xl font-black text-[#2D3E50]">5.2M</h3>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa de Vitória</p>
              <h3 className="text-2xl font-black text-[#2D3E50]">16.92%</h3>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa de Fechamento</p>
              <h3 className="text-2xl font-black text-[#2D3E50]">14.47%</h3>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Média de Dias</p>
              <h3 className="text-2xl font-black text-[#2D3E50]">60.70</h3>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#0047FF] p-5 rounded-xl shadow-lg shadow-blue-500/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Pipeline</p>
              <h3 className="text-2xl font-black italic">77.8M</h3>
           </div>
           <div className="bg-[#8B5CF6] p-5 rounded-xl shadow-lg shadow-purple-500/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Negócios Abertos</p>
              <h3 className="text-2xl font-black italic">1.6K</h3>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#10B981] p-5 rounded-xl shadow-lg shadow-green-500/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Valor Ponderado</p>
              <h3 className="text-2xl font-black italic">35.6M</h3>
           </div>
           <div className="bg-[#2D3E50] p-5 rounded-xl shadow-lg text-white">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Ticket Médio</p>
              <h3 className="text-2xl font-black italic">R$ 3.250</h3>
           </div>
        </div>
      </div>

      {/* 🚀 MAIN DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CHARTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                <h3 className="font-black text-[#2D3E50] uppercase italic tracking-tighter text-lg">Negócios Ganhos (últimos 12 meses)</h3>
                <div className="flex gap-4 text-[9px] font-black text-gray-400">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-adworks-blue"></div> VALOR FECHADO</span>
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> NEGÓCIOS GANHOS</span>
                </div>
             </div>
             <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={DATA_WON}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0047FF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0047FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="val" stroke="#0047FF" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
             <h3 className="font-black text-[#2D3E50] uppercase italic tracking-tighter text-lg mb-8">Projeção de Negócios (próximos 12 meses)</h3>
             <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={DATA_PROJECTION}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="stepAfter" dataKey="val" stroke="#2D3E50" strokeWidth={2} dot={false} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* RIGHT ANALYTICS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-black text-[#2D3E50] uppercase italic text-sm mb-6">Pipeline de Vendas</h3>
              <div className="h-[220px] w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={[{v:400},{v:300},{v:200},{v:100}]} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="v">
                          {DATA_WON.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4 text-[10px] font-bold text-gray-500 uppercase">
                 <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span>Leads de Entrada</span><span className="text-adworks-dark">26.8%</span></div>
                 <div className="flex justify-between p-2"><span>Proposta Enviada</span><span className="text-adworks-dark">14.8%</span></div>
                 <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span>Negociação</span><span className="text-adworks-dark">9.8%</span></div>
              </div>
           </div>

           <div className="bg-[#2D3E50] rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </div>
                 <h3 className="font-black italic uppercase tracking-tight">Equipe Online</h3>
              </div>
              <div className="space-y-4 mb-8">
                 {[
                   { name: 'Matheus Grao', role: 'Operador', status: 'Ativo' },
                   { name: 'Dan Mazzucatto', role: 'Master', status: 'Ativo' },
                   { name: 'Sah Assistant', role: 'AI Engine', status: 'Ativo' }
                 ].map((op, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black border border-white/10">
                             {op.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-[11px] font-black leading-none">{op.name}</p>
                             <p className="text-[9px] text-white/40 uppercase font-bold mt-0.5">{op.role}</p>
                          </div>
                       </div>
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-3 bg-adworks-blue rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-blue-500/20">
                 Gerenciar Equipe
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
