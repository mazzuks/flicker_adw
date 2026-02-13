import { useEffect, useState } from 'react';
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
  ChevronDown
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
  Cell 
} from 'recharts';

const DATA_GROWTH = [
  { name: 'Set', won: 400, value: 2400 },
  { name: 'Out', won: 300, value: 1398 },
  { name: 'Nov', won: 200, value: 9800 },
  { name: 'Dez', won: 278, value: 3908 },
  { name: 'Jan', won: 189, value: 4800 },
  { name: 'Fev', won: 239, value: 3800 },
];

const DATA_PIPELINE = [
  { name: 'CNPJ', value: 400, color: '#0047FF' },
  { name: 'Marca', value: 300, color: '#8B5CF6' },
  { name: 'Fiscal', value: 300, color: '#10B981' },
  { name: 'CRM', value: 200, color: '#F59E0B' },
];

export function MasterDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* 🏁 HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg shadow-orange-600/20">Master Intelligence</span>
             <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic leading-none">BI OVERVIEW</h1>
           </div>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Análise de performance e crescimento global.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-adw-soft border border-gray-100">
           <div className="flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              Últimos 12 Meses
              <ChevronDown className="w-4 h-4 ml-2" />
           </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* 🚀 MAIN CONTENT */}
        <div className="flex-1 space-y-8">
          
          {/* 1. TOP KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-adworks-blue p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all"></div>
               <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Total Sales (MRR)</p>
               <h3 className="text-4xl font-black tracking-tighter italic">R$ 5.2M</h3>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                  <TrendingUp className="w-3 h-3" /> +16.92%
               </div>
            </div>

            <div className="bg-[#8B5CF6] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all"></div>
               <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Active Companies</p>
               <h3 className="text-4xl font-black tracking-tighter italic">1.6K</h3>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                  <Users className="w-3 h-3" /> 14.47% win rate
               </div>
            </div>

            <div className="bg-[#10B981] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all"></div>
               <p className="text-[10px] font-black text-green-100 uppercase tracking-widest mb-2">Weighted Value</p>
               <h3 className="text-4xl font-black tracking-tighter italic">35.6M</h3>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-50 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                  <Target className="w-3 h-3" /> High Confidence
               </div>
            </div>

            <div className="bg-adworks-dark p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg Days to Close</p>
               <h3 className="text-4xl font-black tracking-tighter italic text-adworks-blue">60.7d</h3>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                  <Clock className="w-3 h-3" /> Efficiency Up
               </div>
            </div>
          </div>

          {/* 2. MAIN CHARTS */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-xl font-black text-adworks-dark uppercase italic tracking-tighter">Won Deals Performance</h2>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Growth Tracking - Last 12 Months</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-adworks-blue"></div> Value</div>
                   <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Count</div>
                </div>
             </div>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DATA_GROWTH}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="value" stroke="#0047FF" strokeWidth={4} dot={{ r: 4, fill: '#0047FF', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="won" stroke="#22D3EE" strokeWidth={4} dot={{ r: 4, fill: '#22D3EE', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* 🔍 SIDEBAR ANALYTICS */}
        <div className="w-full xl:w-[400px] space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
              <h3 className="text-sm font-black text-adworks-dark uppercase tracking-[0.2em] mb-8 italic">Sales Pipeline</h3>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DATA_PIPELINE}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {DATA_PIPELINE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute flex flex-col items-center">
                    <p className="text-xs font-black text-gray-400 uppercase">Total</p>
                    <p className="text-3xl font-black text-adworks-dark tracking-tighter">1.2k</p>
                 </div>
              </div>
              <div className="mt-8 space-y-3">
                 {DATA_PIPELINE.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-adworks-gray/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                       </div>
                       <span className="text-xs font-black text-adworks-dark">33%</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-adworks-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
              <h3 className="text-lg font-black mb-6 italic uppercase tracking-tight">Need Help?</h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8 opacity-80">"Os dados de conversão de Marcas INPI cresceram 25% após a nova automação do sistema."</p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                 View Full Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
