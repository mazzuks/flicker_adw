import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
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
  MoreHorizontal
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
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';

/**
 * 🏛️ ADWORKS COMMAND CENTER - MVP ENTERPRISE
 * Arquitetura de dados agregada via Endpoint
 */

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    // Em produção: const { data } = await supabase.functions.invoke('dashboard-aggregator')
    // Usando Mock estruturado conforme SPEC para agilidade no Front
    const mockData = {
      kpis: {
        pipeline_total: "R$ 5.240.800",
        weighted_value: "R$ 35.6M",
        revenue_realized: "R$ 1.2M",
        win_rate: "16.92%",
        active_deals: 1600,
        avg_ticket: "R$ 3.250",
        sla_avg_days: "12.5d"
      },
      alerts: [
        { label: 'Follow-ups vencidos', count: 12, type: 'danger', cta: 'Ver agora' },
        { label: 'Negócios parados > 7 dias', count: 8, type: 'warning', cta: 'Reativar' },
        { label: 'Pendências de documentos', count: 5, type: 'danger', cta: 'Auditar' },
        { label: 'SLA em risco iminente', count: 3, type: 'danger', cta: 'Priorizar' },
      ],
      tasks: [
        { title: 'Aprovar Contrato Social', entity: 'Restaurante S&A', due: 'Hoje' },
        { title: 'Enviar Guia DAS Jan', entity: 'Clínica Sorriso', due: '14:30' },
        { title: 'Validar Marca INPI', entity: 'Buffet Alegria', due: 'Hoje' },
      ],
      charts: {
        performance: [
          { x: 'Set', y: 2400 }, { x: 'Out', y: 3200 }, { x: 'Nov', y: 2800 },
          { x: 'Dez', y: 4500 }, { x: 'Jan', y: 4200 }, { x: 'Fev', y: 5800 },
        ],
        pipeline: [
          { name: 'Entrada', value: 400, color: '#1E5BFF' },
          { name: 'Proposta', value: 300, color: '#8B5CF6' },
          { name: 'Negociação', value: 200, color: '#10B981' },
          { name: 'Ganho', value: 100, color: '#F59E0B' },
        ]
      }
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  };

  if (loading) return <div className="p-12 animate-pulse space-y-8"><div className="h-20 bg-gray-100 rounded-2xl w-1/3" /><div className="h-64 bg-gray-100 rounded-[2.5rem]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 lg:px-8">
      
      {/* 🏛️ HEADER DA PÁGINA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-adworks-border">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none">Command Center</h1>
          <p className="text-adworks-muted text-sm mt-1.5 font-medium italic opacity-70">Operação e performance em tempo real.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
            <input type="text" placeholder="Busca global... (⌘K)" className="w-full pl-11 pr-4 py-2.5 bg-white border border-adworks-border rounded-xl text-xs font-semibold focus:ring-1 focus:ring-adworks-blue outline-none shadow-sm" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-adworks-border rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar className="w-4 h-4 text-adworks-muted mr-1" />
            <span className="text-[10px] font-black text-adworks-dark uppercase tracking-widest">Fevereiro 2026</span>
          </div>
        </div>
      </div>

      {/* BLOCO 1: HERO + KPI SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-adworks-blue rounded-adw-lg p-10 text-white shadow-2xl shadow-blue-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl opacity-50" />
          <div className="relative z-10">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-blue-200">Pipeline Financeiro Global</p>
             <h2 className="text-5xl font-black tracking-tighter leading-none italic">{data.kpis.pipeline_total}</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 mt-12 border-t border-white/10">
                <div><p className="text-[9px] font-black uppercase text-blue-200 opacity-60 mb-1">Win Rate</p><p className="text-2xl font-bold italic">{data.kpis.win_rate}</p></div>
                <div className="border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60 mb-1">Active Deals</p><p className="text-2xl font-bold italic">{data.kpis.active_deals}</p></div>
                <div className="border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60 mb-1">Weighted</p><p className="text-2xl font-bold italic">{data.kpis.weighted_value}</p></div>
                <div className="border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60 mb-1">Revenue</p><p className="text-2xl font-bold italic">{data.kpis.revenue_realized}</p></div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white p-8 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">Ticket Médio</p><ArrowUpRight className="w-4 h-4 text-green-500" /></div>
              <h4 className="text-3xl font-black text-adworks-dark tracking-tighter mt-4">{data.kpis.avg_ticket}</h4>
              <p className="text-[9px] font-bold text-green-600 mt-2">+12.5% vs período anterior</p>
           </div>
           <div className="bg-white p-8 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">SLA Médio</p><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /></div>
              <h4 className="text-3xl font-black text-adworks-dark tracking-tighter mt-4">{data.kpis.sla_avg_days}</h4>
              <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-tighter">Status: Em Risco</p>
           </div>
        </div>
      </div>

      {/* BLOCO 2: ATENÇÃO + AÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
           <div className="p-6 border-b border-adworks-border bg-adworks-bg/30 flex items-center justify-between uppercase">
              <h3 className="font-black text-adworks-dark text-[11px] tracking-[0.1em] italic leading-none">Atenção Hoje</h3>
              <Zap className="w-4 h-4 text-adworks-blue" />
           </div>
           <div className="p-4">
              {data.alerts.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-adworks-bg transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'danger' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-orange-400 shadow-[0_0_8px_#f59e0b]'}`} />
                      <span className="text-sm font-bold text-adworks-muted group-hover:text-adworks-dark transition-colors">{item.label}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`text-xs font-black ${item.type === 'danger' ? 'text-red-600' : 'text-orange-600'}`}>{item.count}</span>
                      <button className="text-[10px] font-black uppercase text-adworks-blue opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.cta}</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
           <div className="p-6 border-b border-adworks-border bg-adworks-bg/30 flex items-center justify-between uppercase">
              <h3 className="font-black text-adworks-dark text-[11px] tracking-[0.1em] italic leading-none">Próximas Ações</h3>
              <CheckCircle2 className="w-4 h-4 text-adworks-muted opacity-30" />
           </div>
           <div className="p-4 overflow-y-auto max-h-[350px]">
              <table className="w-full">
                 <tbody className="divide-y divide-adworks-border">
                    {data.tasks.map((task: any, i: number) => (
                      <tr key={i} className="group hover:bg-adworks-bg transition-colors">
                         <td className="py-5 px-3">
                            <p className="text-sm font-black text-adworks-dark tracking-tight leading-none mb-1.5">{task.title}</p>
                            <p className="text-[10px] font-bold text-adworks-muted uppercase tracking-widest">{task.entity}</p>
                         </td>
                         <td className="py-5 px-3 text-right">
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${task.due === 'Hoje' ? 'text-red-500' : 'text-adworks-muted'}`}>{task.due}</span>
                            <button className="ml-5 w-9 h-9 rounded-xl bg-adworks-bg text-adworks-muted group-hover:bg-adworks-blue group-hover:text-white transition-all inline-flex items-center justify-center shadow-inner">
                               <ArrowRight className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* BLOCO 3: PERFORMANCE + PIPELINE DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 border-b border-adworks-border pb-8">
              <div>
                 <h3 className="text-xl font-black text-adworks-dark uppercase italic leading-none tracking-tight">Fluxo de Performance Histórica</h3>
                 <p className="text-adworks-muted text-[10px] font-black uppercase tracking-[0.2em] mt-3">Análise de Receita Realizada vs Período Anterior</p>
              </div>
              <div className="flex bg-adworks-bg p-1 rounded-xl shadow-inner border border-gray-100">
                 {['Mês', 'Semana', 'Dia'].map(t => (
                   <button key={t} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm' : 'text-adworks-muted hover:text-adworks-dark'}`}>{t}</button>
                 ))}
              </div>
           </div>
           <div className="h-[400px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.charts.performance}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E5BFF" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#1E5BFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '20px'}} />
                    <Area type="monotone" dataKey="y" stroke="#1E5BFF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" activeDot={{ r: 8, fill: '#1E5BFF', strokeWidth: 4, stroke: '#fff' }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card">
           <h3 className="font-black text-adworks-dark text-sm uppercase tracking-widest mb-10 italic">Distribuição do Pipeline</h3>
           <div className="h-[250px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={data.charts.pipeline} innerRadius={75} outerRadius={95} paddingAngle={6} dataKey="value">
                       {data.charts.pipeline.map((entry: any, index: number) => <Cell key={index} fill={entry.color} stroke="none" />)}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
                 <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest">Total Global</p>
                 <p className="text-4xl font-black text-adworks-dark tracking-tighter italic leading-none mt-1">1.0k</p>
              </div>
           </div>
           <div className="space-y-2 mt-12">
              {data.charts.pipeline.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-adworks-bg rounded-2xl border border-transparent hover:border-adworks-border transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-adworks-muted uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-adworks-dark">{item.pct || '25'}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
