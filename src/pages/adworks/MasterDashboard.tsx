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
  CheckCircle2,
  LayoutGrid
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

const DATA_WON_MONTHLY = [
  { name: 'Mai 2024', val: 400 }, { name: 'Jun 2024', val: 500 }, { name: 'Jul 2024', val: 450 },
  { name: 'Ago 2024', val: 600 }, { name: 'Set 2024', val: 780 }, { name: 'Out 2024', val: 720 },
  { name: 'Nov 2024', val: 850 }, { name: 'Dez 2024', val: 680 }, { name: 'Jan 2025', val: 920 },
  { name: 'Fev 2025', val: 880 }, { name: 'Mar 2025', val: 980 }, { name: 'Abr 2025', val: 1050 },
];

const DATA_WON_WEEKLY = [
  { name: 'W1', val: 150 }, { name: 'W2', val: 230 }, { name: 'W3', val: 180 }, { name: 'W4', val: 310 },
  { name: 'W5', val: 250 }, { name: 'W6', val: 400 }, { name: 'W7', val: 320 }, { name: 'W8', val: 450 },
];

const DATA_WON_DAILY = [
  { name: '01', val: 20 }, { name: '02', val: 45 }, { name: '03', val: 30 }, { name: '04', val: 65 },
  { name: '05', val: 50 }, { name: '06', val: 80 }, { name: '07', val: 40 }, { name: '08', val: 95 },
];

const DATA_PROJECTION = [
  { name: 'Mai 2025', val: 1100 }, { name: 'Jun 2025', val: 1150 }, { name: 'Jul 2025', val: 1200 },
  { name: 'Ago 2025', val: 1250 }, { name: 'Set 2025', val: 1300 }, { name: 'Out 2025', val: 1350 },
  { name: 'Nov 2025', val: 1400 }, { name: 'Dez 2025', val: 1450 }, { name: 'Jan 2026', val: 1500 },
  { name: 'Feb 2026', val: 1550 }, { name: 'Mar 2026', val: 1600 }, { name: 'Abr 2026', val: 1650 },
];

const COLORS = ['#0047FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export function MasterDashboard() {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | '3months'>('month');
  const [projFilter, setProjFilter] = useState<'short' | 'mid' | 'long'>('long');

  const getActiveData = () => {
    switch (timeFilter) {
      case 'day': return DATA_WON_DAILY;
      case 'week': return DATA_WON_WEEKLY;
      case '3months': return DATA_WON_MONTHLY.slice(-3);
      default: return DATA_WON_MONTHLY;
    }
  };

  const getProjectionData = () => {
    switch (projFilter) {
      case 'short': return DATA_PROJECTION.slice(0, 3);
      case 'mid': return DATA_PROJECTION.slice(0, 6);
      default: return DATA_PROJECTION;
    }
  };

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
           <div className="bg-adworks-blue p-5 rounded-xl shadow-lg shadow-blue-500/20 text-white">
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
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-50 pb-6 gap-4">
                <div>
                   <h3 className="font-black text-[#2D3E50] uppercase italic tracking-tighter text-lg leading-none">Negócios Ganhos</h3>
                   <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Performance Analytics Board</p>
                </div>
                
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
                   {[
                     { id: 'day', label: 'Dia' },
                     { id: 'week', label: 'Semana' },
                     { id: 'month', label: 'Mês' },
                     { id: '3months', label: '3 Meses' }
                   ].map((f) => (
                     <button
                        key={f.id}
                        onClick={() => setTimeFilter(f.id as any)}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          timeFilter === f.id ? 'bg-white text-adworks-blue shadow-sm' : 'text-gray-400 hover:text-adworks-dark'
                        }`}
                     >
                       {f.label}
                     </button>
                   ))}
                </div>
             </div>

             <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={getActiveData()}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0047FF" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#0047FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}}
                        tickFormatter={(value) => `${value >= 1000 ? value/1000 + 'k' : value}`}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}
                        labelStyle={{fontWeight: '900', color: '#2D3E50', textTransform: 'uppercase'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#0047FF" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorVal)" 
                        activeDot={{ r: 8, fill: '#0047FF', strokeWidth: 0 }}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* 📊 SECOND CHART: PROJECTIONS (Detailed) */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-50 pb-6 gap-4">
                <div>
                   <h3 className="font-black text-[#2D3E50] uppercase italic tracking-tighter text-lg leading-none">Projeção de Negócios</h3>
                   <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Next 12 Months Forecast</p>
                </div>
                
                <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
                   {[
                     { id: 'short', label: '3 Meses' },
                     { id: 'mid', label: '6 Meses' },
                     { id: 'long', label: '12 Meses' }
                   ].map((f) => (
                     <button
                        key={f.id}
                        onClick={() => setProjFilter(f.id as any)}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          projFilter === f.id ? 'bg-white text-[#2D3E50] shadow-sm' : 'text-gray-400 hover:text-adworks-dark'
                        }`}
                     >
                       {f.label}
                     </button>
                   ))}
                </div>
             </div>
             <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={getProjectionData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}}
                        tickFormatter={(value) => `${value >= 1000 ? value/1000 + 'k' : value}`}
                      />
                      <Tooltip />
                      <Line 
                        type="stepAfter" 
                        dataKey="val" 
                        stroke="#2D3E50" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#2D3E50', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6 }}
                      />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* RIGHT ANALYTICS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-black text-[#2D3E50] uppercase italic text-sm mb-6">Pipeline de Vendas</h3>
              <div className="h-[220px] w-full flex items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={[{v:400},{v:300},{v:200},{v:100}]} innerRadius={70} outerRadius={95} paddingAngle={5} dataKey="v">
                          {DATA_WON_MONTHLY.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-3xl font-black text-[#2D3E50] tracking-tighter">1.2k</p>
                 </div>
              </div>
              <div className="space-y-2 mt-6 text-[10px] font-bold text-gray-500 uppercase">
                 <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Leads de Entrada</span><span className="text-adworks-dark font-black">26.8%</span></div>
                 <div className="flex justify-between p-3"><span>Proposta Enviada</span><span className="text-adworks-dark font-black">14.8%</span></div>
                 <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Negociação</span><span className="text-adworks-dark font-black">9.8%</span></div>
              </div>
           </div>

           <div className="bg-[#2D3E50] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-green-500/20 transition-all duration-700"></div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
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
                             <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-tighter">{op.role}</p>
                          </div>
                       </div>
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-4 bg-adworks-blue rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                 Gerenciar Equipe
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
