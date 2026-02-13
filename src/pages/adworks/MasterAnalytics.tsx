import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown,
  ArrowUpRight,
  PieChart as PieIcon,
  Activity,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Set', revenue: 45000, growth: 10 },
  { month: 'Out', revenue: 52000, growth: 15 },
  { month: 'Nov', revenue: 48000, growth: -8 },
  { month: 'Dez', revenue: 61000, growth: 25 },
  { month: 'Jan', revenue: 58000, growth: -5 },
  { month: 'Fev', revenue: 72000, growth: 22 },
];

const SOURCE_DATA = [
  { name: 'Orgânico', value: 400, color: '#0047FF' },
  { name: 'Google Ads', value: 300, color: '#8B5CF6' },
  { name: 'Instagram', value: 300, color: '#10B981' },
  { name: 'Indicação', value: 200, color: '#F59E0B' },
];

export function MasterAnalytics() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* 🏁 HEADER & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg shadow-blue-500/20">Business Intelligence</span>
             <h1 className="text-4xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-none">Métricas & Relatórios</h1>
           </div>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Acompanhamento de ROI, crescimento e saúde do ecossistema.</p>
        </div>

        <div className="flex items-center gap-3">
           <button className="bg-white border border-gray-100 text-[#2D3E50] px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-3">
              <Download className="w-4 h-4 text-gray-400" />
              Exportar CSV
           </button>
           <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-[#2D3E50] uppercase tracking-widest cursor-pointer">
                 <Calendar className="w-4 h-4 mr-2" />
                 Fev 2026
                 <ChevronDown className="w-4 h-4 ml-2 text-gray-300" />
              </div>
           </div>
        </div>
      </div>

      {/* 📊 CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2D3E50] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/30 transition-all"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MRR (Monthly Recurring Revenue)</p>
          <h3 className="text-4xl font-black tracking-tighter italic">R$ 142.450</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-green-400 gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CAC (Custo de Aquisição)</p>
          <h3 className="text-4xl font-black tracking-tighter italic text-[#2D3E50]">R$ 450,20</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-adworks-blue gap-2">
            <Activity className="w-4 h-4" />
            <span>Eficiência: Alta</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Churn Rate</p>
          <h3 className="text-4xl font-black tracking-tighter italic text-[#2D3E50]">1.2%</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-green-500 gap-2">
            <Target className="w-4 h-4" />
            <span>Meta: Abaixo de 2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* REVENUE CHART (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-[#2D3E50] uppercase italic tracking-tighter">Crescimento de Receita</h2>
              <div className="flex items-center gap-4 text-[9px] font-black text-gray-400">
                 <span className="flex items-center gap-1.5 uppercase"><div className="w-2 h-2 rounded-full bg-adworks-blue"></div> Revenue</span>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="revenue" fill="#0047FF" radius={[8, 8, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* PIE CHART (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100 flex flex-col justify-between">
           <h3 className="text-sm font-black text-[#2D3E50] uppercase tracking-widest italic mb-8">Origem dos Clientes</h3>
           <div className="h-[250px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={SOURCE_DATA} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                       {SOURCE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
                 <p className="text-3xl font-black text-[#2D3E50] tracking-tighter">1.2k</p>
              </div>
           </div>
           <div className="space-y-3 mt-8">
              {SOURCE_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-[#E2E8F0] transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-[#2D3E50]">33%</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
