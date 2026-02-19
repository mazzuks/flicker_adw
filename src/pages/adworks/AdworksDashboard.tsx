import { useState, useEffect } from 'react';
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
  MoreHorizontal,
  DollarSign,
  Globe,
  Plus
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
 * 🏛️ ADWORKS COMMAND CENTER - MVP ENTERPRISE FINAL
 * Implementação completa conforme especificações do TXT.
 */

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('mês');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    // Simulação do endpoint GET /api/dashboard/command-center
    const mockData = {
      period: { label: "Fevereiro 2026" },
      kpis: {
        pipeline_total: "R$ 5.240.800",
        weighted_value: "R$ 35.6M",
        revenue_realized: "R$ 1.2M",
        win_rate: "16.92%",
        active_deals: 1600,
        avg_ticket: "R$ 3.250",
        sla_avg_days: "12.5d",
        deltas: { ticket: "+12%", sla: "-1.2d" }
      },
      alerts: [
        { label: 'Follow-ups vencidos', count: 12, type: 'danger', cta: 'Ver agora' },
        { label: 'Negócios parados > 7 dias', count: 8, type: 'warning', cta: 'Reativar' },
        { label: 'Pendências de documentos', count: 5, type: 'danger', cta: 'Auditar' },
        { label: 'SLA em risco iminente', count: 3, type: 'danger', cta: 'Priorizar' },
      ],
      actions: {
        tasks: [
          { title: 'Aprovar Contrato Social', entity: 'Restaurante S&A', due: 'Hoje' },
          { title: 'Enviar Guia DAS Jan', entity: 'Clínica Sorriso', due: '14:30' },
          { title: 'Validar Marca INPI', entity: 'Buffet Alegria', due: 'Hoje' },
        ],
        messages: [
          { from: "Restaurante S&A", snippet: "Enviamos o protocolo...", status: "new" },
          { from: "Dona Helena", snippet: "Dúvida sobre o regime...", status: "pending" }
        ]
      },
      charts: {
        performance: [
          { x: 'Set', y: 2400 }, { x: 'Out', y: 3200 }, { x: 'Nov', y: 2800 },
          { x: 'Dez', y: 4500 }, { x: 'Jan', y: 4200 }, { x: 'Fev', y: 5800 },
        ],
        pipeline: [
          { name: 'Leads', value: 400, color: '#1E5BFF' },
          { name: 'Proposta', value: 300, color: '#8B5CF6' },
          { name: 'Negociação', value: 200, color: '#10B981' },
          { name: 'Ganho', value: 100, color: '#F59E0B' },
        ],
        operational: [
          { stage: 'Triagem', avg_days: 2.5, conversion: '92%' },
          { stage: 'Junta', avg_days: 8.1, conversion: '85%' },
          { stage: 'Inscrição', avg_days: 1.4, conversion: '98%' }
        ],
        finance: {
          receber: "R$ 142.4k",
          pagar: "R$ 58.2k",
          sparkline: [{v:10}, {v:15}, {v:8}, {v:25}, {v:18}, {v:30}]
        }
      },
      team: [
        { name: 'Matheus Grao', tasks: 12, status: 'Online', sla: '1.2d' },
        { name: 'Dan Mazzucatto', tasks: 3, status: 'Online', sla: '0.8d' },
        { name: 'Sah AI', tasks: 0, status: 'Active', sla: '0.1d' },
      ]
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  };

  if (loading) return <div className="p-12 animate-pulse space-y-8 bg-adworks-bg min-h-screen"><div className="h-20 bg-white rounded-2xl w-1/3 shadow-sm" /><div className="h-64 bg-white rounded-adw-lg shadow-sm" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 lg:px-8 bg-adworks-bg min-h-screen">
      
      {/* 🏛️ HEADER DA PÁGINA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6 border-b border-adworks-border">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none">Command Center</h1>
          <p className="text-adworks-muted text-sm mt-1.5 font-medium">Operação, performance e alertas em tempo real</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
            <input type="text" placeholder="Busca global... (⌘K)" className="w-full pl-10 pr-4 py-2 bg-white border border-adworks-border rounded-adw text-sm focus:ring-1 focus:ring-adworks-blue outline-none shadow-sm" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-adworks-border rounded-adw px-4 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-adworks-muted mr-1" />
            <span className="text-xs font-bold text-adworks-dark uppercase tracking-wider">{data.period.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BLOCO 1: HERO (8 cols) + KPIs (4 cols) */}
        <div className="lg:col-span-8 bg-adworks-blue rounded-adw-lg p-8 text-white shadow-adw-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl opacity-50" />
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-blue-100 opacity-80 flex items-center gap-2">
                   Pipeline Financeiro Global <Info className="w-3 h-3" />
                </p>
                <h2 className="text-5xl font-black tracking-tighter leading-none italic">{data.kpis.pipeline_total},00</h2>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 mt-10 border-t border-white/10">
                <div className="space-y-1"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60">Win Rate</p><p className="text-xl font-bold italic">{data.kpis.win_rate}</p></div>
                <div className="space-y-1 border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60">Active Deals</p><p className="text-xl font-bold italic">{data.kpis.active_deals}</p></div>
                <div className="space-y-1 border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60">Weighted</p><p className="text-xl font-bold italic">{data.kpis.weighted_value}</p></div>
                <div className="space-y-1 border-l border-white/5 pl-8"><p className="text-[9px] font-black uppercase text-blue-200 opacity-60">Revenue</p><p className="text-xl font-bold italic">{data.kpis.revenue_realized}</p></div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">Ticket Médio</p><ArrowUpRight className="w-4 h-4 text-status-success" /></div>
              <h4 className="text-3xl font-black text-adworks-dark tracking-tighter mt-4">{data.kpis.avg_ticket}</h4>
              <p className="text-[9px] font-bold text-status-success mt-2 uppercase tracking-tighter">{data.kpis.deltas.ticket} vs período anterior</p>
           </div>
           <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">SLA Médio</p><div className="w-2 h-2 bg-status-danger rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" /></div>
              <h4 className="text-3xl font-black text-adworks-dark tracking-tighter mt-4">{data.kpis.sla_avg_days}</h4>
              <p className="text-[9px] font-bold text-status-danger mt-2 uppercase tracking-tighter">Status: {data.kpis.deltas.sla} (Em Risco)</p>
           </div>
        </div>

        {/* BLOCO 2: ATENÇÃO (6 cols) + AÇÕES (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden flex flex-col">
           <div className="p-5 border-b border-adworks-border bg-adworks-bg/30 flex items-center justify-between">
              <h3 className="font-black text-adworks-dark text-[11px] tracking-[0.1em] uppercase italic">Atenção Hoje</h3>
              <span className="text-[9px] font-black bg-status-danger text-white px-2 py-0.5 rounded-md">CRÍTICO</span>
           </div>
           <div className="p-4 space-y-1 flex-1">
              {data.alerts.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-adworks-bg transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'danger' ? 'bg-status-danger shadow-[0_0_8px_#ef4444]' : 'bg-status-warning shadow-[0_0_8px_#f59e0b]'}`} />
                      <span className="text-sm font-bold text-adworks-muted group-hover:text-adworks-dark transition-colors">{item.label}</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className={`text-xs font-black ${item.type === 'danger' ? 'text-status-danger' : 'text-status-warning'}`}>{item.count}</span>
                      <button className="text-[10px] font-black uppercase text-adworks-blue opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.cta}</button>
                   </div>
                </div>
              ))}
           </div>
           <button className="p-4 text-center text-[9px] font-black text-adworks-muted border-t border-adworks-border hover:text-adworks-blue uppercase tracking-widest">Ver todos os alertas</button>
        </div>

        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden flex flex-col">
           <div className="p-5 border-b border-adworks-border bg-adworks-bg/30 flex items-center justify-between">
              <h3 className="font-black text-adworks-dark text-[11px] tracking-[0.1em] uppercase italic">Próximas Ações</h3>
              <CheckCircle2 className="w-4 h-4 text-adworks-muted opacity-30" />
           </div>
           <div className="flex-1 overflow-y-auto max-h-[350px]">
              <table className="w-full">
                 <tbody className="divide-y divide-adworks-border">
                    {data.actions.tasks.map((task: any, i: number) => (
                      <tr key={i} className="group hover:bg-adworks-bg transition-colors">
                         <td className="py-5 px-6">
                            <p className="text-sm font-black text-adworks-dark tracking-tight leading-none mb-1.5 uppercase italic">{task.title}</p>
                            <p className="text-[10px] font-bold text-adworks-muted uppercase tracking-widest">{task.entity} • Resp: {task.owner}</p>
                         </td>
                         <td className="py-5 px-6 text-right">
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${task.due === 'Hoje' ? 'text-status-danger' : 'text-adworks-muted'}`}>{task.due}</span>
                            <button className="ml-5 w-10 h-10 rounded-xl bg-adworks-bg text-adworks-muted group-hover:bg-adworks-blue group-hover:text-white transition-all inline-flex items-center justify-center shadow-inner">
                               <ArrowRight className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <button className="p-4 text-center text-[9px] font-black text-adworks-muted border-t border-adworks-border hover:text-adworks-blue uppercase tracking-widest">Abrir Lista de Tarefas</button>
        </div>

        {/* LINHA 3: PERFORMANCE (8 cols) + PIPELINE DONUT (4 cols) */}
        <div className="lg:col-span-8 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 border-b border-adworks-border pb-8">
            <div>
              <h3 className="text-xl font-bold text-adworks-dark tracking-tight uppercase italic italic">Fluxo de Performance Histórica</h3>
              <div className="flex gap-6 mt-4">
                 <div className="flex items-center gap-2"><p className="text-[9px] font-black text-adworks-muted uppercase tracking-[0.2em]">Melhor: R$ 9.8k</p></div>
                 <div className="flex items-center gap-2 border-l border-adworks-border pl-6"><p className="text-[9px] font-black text-adworks-muted uppercase tracking-[0.2em]">Pior: R$ 1.4k</p></div>
              </div>
            </div>
            <div className="flex bg-adworks-bg p-1 rounded-xl shadow-inner border border-white">
               {['Mês', 'Semana', 'Dia'].map(t => (
                 <button key={t} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm scale-105' : 'text-adworks-muted hover:text-adworks-dark'}`}>{t}</button>
               ))}
            </div>
          </div>
          <div className="h-[380px] w-full pr-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.charts.performance}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5BFF" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#1E5BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} dy={12} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '20px'}}
                    itemStyle={{fontWeight: '900', textTransform: 'uppercase', fontSize: '10px'}}
                  />
                  <Area type="monotone" dataKey="y" stroke="#1E5BFF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" activeDot={{ r: 8, fill: '#1E5BFF', strokeWidth: 0 }} />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
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
                 <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest leading-none">Total Deals</p>
                 <p className="text-4xl font-black text-[#2D3E50] tracking-tighter italic mt-2">1.2k</p>
              </div>
           </div>
           <div className="space-y-2 mt-12 flex-1">
              {data.charts.pipeline.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-adworks-bg rounded-2xl border border-transparent hover:border-adworks-border transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-adworks-muted uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-adworks-dark">{item.pct}%</span>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-4 border-t border-adworks-border border-dashed">
              <p className="text-[10px] font-bold text-status-danger uppercase tracking-tighter flex items-center gap-1.5 animate-pulse italic">
                 <AlertTriangle className="w-3.5 h-3.5" /> Gargalo: Proposta Enviada
              </p>
           </div>
        </div>

        {/* LINHA 4: PIPELINE OPERACIONAL (6 cols) + FINANCEIRO (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card">
           <div className="flex items-center justify-between mb-10 border-b border-adworks-border pb-6">
              <h3 className="font-black text-adworks-dark text-sm uppercase tracking-widest italic leading-none">Performance Operacional</h3>
              <button className="text-[9px] font-black uppercase text-adworks-blue hover:underline">Abrir Pipeline</button>
           </div>
           <div className="space-y-8">
              {data.charts.operational.map((s: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em]">
                      <span className="text-adworks-muted">{s.stage}</span>
                      <span className="text-adworks-dark italic">{s.avg_days} dias • {s.conversion} conv</span>
                   </div>
                   <div className="h-1.5 w-full bg-adworks-bg rounded-full overflow-hidden">
                      <div className="bg-adworks-blue h-full shadow-[0_0_8px_rgba(30,91,255,0.4)]" style={{ width: s.conversion }} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card flex flex-col">
           <div className="flex items-center justify-between mb-10 border-b border-adworks-border pb-6">
              <h3 className="font-black text-adworks-dark text-sm uppercase tracking-widest italic leading-none">Financeiro Consolidado</h3>
              <button className="text-[9px] font-black uppercase text-adworks-blue hover:underline">Abrir Financeiro</button>
           </div>
           <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="p-8 bg-adworks-bg rounded-[2rem] border border-transparent hover:border-adworks-blue/10 transition-all group">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-2 group-hover:text-adworks-blue">A Receber (30d)</p>
                 <p className="text-2xl font-black text-adworks-dark italic tracking-tighter">{data.charts.finance.receber}</p>
              </div>
              <div className="p-8 bg-adworks-bg rounded-[2rem] border border-transparent hover:border-status-danger/10 transition-all group">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-2 group-hover:text-status-danger text-status-danger">A Pagar (30d)</p>
                 <p className="text-2xl font-black text-adworks-dark italic tracking-tighter">{data.charts.finance.pagar}</p>
              </div>
           </div>
           <div className="flex-1 bg-[#0F1B2D] rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl transition-all duration-1000 group-hover:bg-adworks-blue/40"></div>
              <div className="flex items-center justify-between mb-6">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Caixa Previsto vs Realizado</p>
                 <TrendingUp className="w-5 h-5 text-status-success animate-pulse" />
              </div>
              <div className="h-[80px] w-full pr-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.charts.finance.sparkline}>
                       <Line type="monotone" dataKey="v" stroke="#1E5BFF" strokeWidth={4} dot={false} shadow="0 0 10px #1E5BFF" />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* LINHA 5: TIME (4 cols) + MENSAGENS (4 cols) + QUICK ACTIONS (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card">
           <h3 className="font-black text-adworks-dark text-sm uppercase tracking-widest mb-10 italic leading-none">Time & Workload</h3>
           <div className="space-y-6">
              {data.team.map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-adworks-bg p-2 rounded-2xl transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-adworks-accent rounded-2xl flex items-center justify-center font-black text-xs text-adworks-blue border border-adworks-border shadow-sm group-hover:scale-105 transition-transform">{m.name.charAt(0)}</div>
                      <div>
                         <p className="text-xs font-black text-adworks-dark leading-none uppercase italic">{m.name.split(' ')[0]}</p>
                         <p className="text-[9px] font-black text-status-success uppercase mt-1.5 tracking-tighter">{m.status}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-adworks-muted uppercase leading-none">{m.tasks} DEALS</p>
                      <p className="text-[10px] font-black text-adworks-dark mt-1.5">SLA: {m.sla}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-adw-lg p-10 border border-adworks-border shadow-adw-card flex flex-col">
           <div className="flex items-center justify-between mb-10 border-b border-adworks-border pb-6">
              <h3 className="font-black text-adworks-dark text-sm uppercase tracking-widest italic leading-none">Inbox Priority</h3>
              <span className="bg-status-danger text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter animate-pulse shadow-lg shadow-red-500/20">5 NEW</span>
           </div>
           <div className="space-y-4 flex-1">
              {data.actions.messages.map((msg: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-[1.5rem] hover:bg-adworks-bg border border-transparent hover:border-adworks-border transition-all cursor-pointer group">
                   <div className="w-12 h-12 bg-adworks-accent rounded-2xl flex items-center justify-center text-adworks-muted group-hover:text-adworks-blue shadow-inner shrink-0">
                      <MessageSquare className="w-5 h-5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-xs font-black text-adworks-dark uppercase italic truncate tracking-tight">{msg.from}</p>
                      <p className="text-[10px] font-medium text-adworks-muted truncate mt-1 leading-relaxed opacity-70">{msg.snippet}</p>
                   </div>
                </div>
              ))}
           </div>
           <button onClick={() => navigate('/operator/messages')} className="mt-8 w-full py-4 bg-adworks-bg rounded-2xl text-[10px] font-black uppercase text-adworks-muted hover:bg-adworks-blue hover:text-white transition-all shadow-inner tracking-widest">Acessar Correio Global</button>
        </div>

        <div className="lg:col-span-4 bg-[#0F1B2D] rounded-adw-lg p-10 text-white shadow-2xl flex flex-col relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/40 transition-all duration-700"></div>
           <h3 className="font-black text-white text-sm uppercase tracking-[0.2em] mb-10 italic flex items-center gap-3 relative z-10">
              <Zap className="w-5 h-5 text-adworks-blue fill-adworks-blue" />
              Quick Actions
           </h3>
           <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
              {[
                { label: 'Novo Cliente', icon: Plus, path: '/operator/clients' },
                { label: 'Proposta', icon: FileText, path: '/operator/tasks' },
                { label: 'Carga Fiscal', icon: Target, path: '/operator/tickets/fiscal' },
                { icon: Globe, label: 'Criar Site', path: '/operator/site' },
              ].map((act, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(act.path)}
                  className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-adworks-blue hover:border-adworks-blue hover:shadow-xl transition-all group flex flex-col items-center justify-center gap-3 active:scale-95 shadow-inner"
                >
                   <act.icon className="w-6 h-6 text-adworks-blue group-hover:text-white group-hover:scale-110 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-white leading-none">{act.label}</span>
                </button>
              ))}
           </div>
           <div className="mt-10 pt-6 border-t border-white/5 opacity-30">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-center">Engine Secured v1.2</p>
           </div>
        </div>

      </div>
    </div>
  );
}
