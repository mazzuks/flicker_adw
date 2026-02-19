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
  ArrowDownRight,
  Search, 
  Calendar, 
  ChevronDown, 
  Info, 
  Filter, 
  MoreHorizontal,
  FileText,
  MessageSquare,
  CheckCircle2,
  Activity,
  Zap,
  MousePointer2,
  DollarSign,
  Globe,
  Plus,
  ArrowRight
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
  Line
} from 'recharts';

const DATA_HISTORY = [
  { name: 'Set', val: 2400 }, { name: 'Out', val: 3200 }, { name: 'Nov', val: 2800 },
  { name: 'Dez', val: 4500 }, { name: 'Jan', val: 4200 }, { name: 'Fev', val: 5800 },
];

const DATA_PIPELINE = [
  { name: 'Entrada', value: 400, color: '#1E5BFF' },
  { name: 'Proposta', value: 300, color: '#8B5CF6' },
  { name: 'Negociação', value: 200, color: '#10B981' },
  { name: 'Ganho', value: 100, color: '#F59E0B' },
];

const MINI_SPARKLINE = [
  { v: 10 }, { v: 15 }, { v: 8 }, { v: 25 }, { v: 18 }, { v: 30 }
];

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4 lg:px-8 bg-adworks-bg">
      
      {/* 🏛️ HEADER DA PÁGINA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-adworks-border">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight">Command Center</h1>
          <p className="text-adworks-muted text-sm mt-1 font-medium">Operação, performance e alertas em tempo real</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
            <input 
              type="text" 
              placeholder="Busca global (Ctrl+K)" 
              className="w-full pl-10 pr-4 py-2 bg-white border border-adworks-border rounded-adw text-sm focus:ring-1 focus:ring-adworks-blue outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-adworks-border rounded-adw px-4 py-2 shadow-sm cursor-pointer hover:bg-white transition-colors">
            <Calendar className="w-4 h-4 text-adworks-muted" />
            <span className="text-xs font-bold text-adworks-dark uppercase tracking-wider">Mês Atual</span>
            <ChevronDown className="w-3 h-3 text-adworks-muted ml-1" />
          </div>

          <button className="bg-adworks-blue text-white px-4 py-2 rounded-adw text-xs font-bold shadow-lg shadow-blue-500/20 hover:brightness-110 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Ações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LINHA 1: HERO (8 cols) + KPIs (4 cols) */}
        <div className="lg:col-span-8 bg-adworks-blue rounded-adw-lg p-8 text-white shadow-adw-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 text-blue-200">Pipeline Financeiro Global</p>
                <h3 className="text-4xl font-bold tracking-tight leading-none italic">R$ 5.240.800,00</h3>
              </div>
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-adw text-[10px] font-black uppercase tracking-widest transition-all">Análise Detalhada</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest opacity-60">Win Rate</p>
                <p className="text-xl font-bold italic">16.92%</p>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-6">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest opacity-60">Active Deals</p>
                <p className="text-xl font-bold italic">1.6k</p>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-6">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest opacity-60">Ponderado</p>
                <p className="text-xl font-bold italic">35.6M</p>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-6">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest opacity-60">Realizado</p>
                <p className="text-xl font-bold italic">R$ 1.2M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">Ticket Médio</p>
              <div className="flex items-center gap-1 text-[10px] font-black text-status-success bg-status-successTint px-2 py-0.5 rounded-full border border-status-success/10">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </div>
            </div>
            <h4 className="text-3xl font-bold text-adworks-dark mt-3 tracking-tighter">R$ 3.250</h4>
          </div>
          
          <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">SLA Médio</p>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-status-dangerTint text-status-danger border border-status-danger/10 uppercase">Em Risco</span>
            </div>
            <h4 className="text-3xl font-bold text-adworks-dark mt-3 tracking-tighter">12.5 d</h4>
          </div>
        </div>

        {/* LINHA 2: ATENÇÃO (6 cols) + TAREFAS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
          <div className="p-6 border-b border-adworks-border flex items-center justify-between bg-adworks-bg/30">
            <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic leading-none">Atenção Hoje</h3>
            <Activity className="w-4 h-4 text-adworks-muted opacity-30" />
          </div>
          <div className="p-4 space-y-1">
            {[
              { label: 'Follow-ups vencidos', count: 12, type: 'danger', cta: 'Ver agora' },
              { label: 'Negócios parados > 7 dias', count: 8, type: 'warning', cta: 'Reativar' },
              { label: 'Pendências de documentos', count: 5, type: 'danger', cta: 'Auditar' },
              { label: 'SLA em risco iminente', count: 3, type: 'danger', cta: 'Priorizar' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-adworks-bg transition-colors group">
                <div className="flex items-center gap-3 text-sm font-bold text-adworks-muted group-hover:text-adworks-dark">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'danger' ? 'bg-status-danger' : 'bg-status-warning'}`} />
                  {item.label}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black ${item.type === 'danger' ? 'text-status-danger' : 'text-status-warning'}`}>{item.count}</span>
                  <button className="text-[10px] font-black uppercase text-adworks-blue hover:underline opacity-0 group-hover:opacity-100 transition-opacity">{item.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
          <div className="p-6 border-b border-adworks-border flex items-center justify-between bg-adworks-bg/30">
            <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic leading-none">Próximas Ações</h3>
            <CheckCircle2 className="w-4 h-4 text-adworks-muted opacity-30" />
          </div>
          <div className="p-4 overflow-y-auto max-h-[320px]">
            <table className="w-full text-left">
              <tbody className="divide-y divide-adworks-border">
                {[
                  { title: 'Aprovar Contrato Social', entity: 'Restaurante S&A', due: 'Hoje' },
                  { title: 'Enviar Guia DAS Jan', entity: 'Clínica Sorriso', due: '14:30' },
                  { title: 'Validar Marca INPI', entity: 'Buffet Alegria', due: 'Hoje' },
                ].map((item, i) => (
                  <tr key={i} className="group hover:bg-adworks-bg transition-colors">
                    <td className="py-4 px-3">
                      <p className="text-sm font-bold text-adworks-dark">{item.title}</p>
                      <p className="text-[10px] font-medium text-adworks-muted uppercase tracking-tighter">{item.entity}</p>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <span className={`text-[10px] font-black uppercase ${item.due === 'Hoje' ? 'text-status-danger' : 'text-adworks-muted'}`}>{item.due}</span>
                      <button className="ml-4 w-8 h-8 rounded-lg bg-adworks-bg text-adworks-muted group-hover:bg-adworks-blue group-hover:text-white transition-all inline-flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LINHA 3: PERFORMANCE (8 cols) + DISTRIBUIÇÃO (4 cols) */}
        <div className="lg:col-span-8 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 border-b border-adworks-border pb-6">
            <div>
              <h3 className="text-xl font-bold text-adworks-dark tracking-tight uppercase italic leading-none italic">Fluxo de Performance Histórica</h3>
              <div className="flex gap-4 mt-3">
                 <div className="flex items-center gap-1.5"><p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest">Melhor: R$ 9.8k</p></div>
                 <div className="flex items-center gap-1.5"><p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest">Pior: R$ 1.4k</p></div>
              </div>
            </div>
            <div className="flex bg-adworks-bg p-1 rounded-xl shadow-inner">
               {['Mês', 'Semana', 'Dia'].map(t => (
                 <button key={t} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm' : 'text-adworks-muted hover:text-adworks-dark'}`}>{t}</button>
               ))}
            </div>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA_HISTORY}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5BFF" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#1E5BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} dy={12} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="val" stroke="#1E5BFF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card">
           <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest mb-10 italic">Distribuição do Pipeline</h3>
           <div className="h-[240px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={DATA_PIPELINE} innerRadius={70} outerRadius={95} paddingAngle={6} dataKey="value">
                       {DATA_PIPELINE.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest">Global</p>
                 <p className="text-4xl font-black text-adworks-dark tracking-tighter italic">1.0k</p>
              </div>
           </div>
           <div className="space-y-2 mt-10">
              {DATA_PIPELINE.map((item, i) => (
                <div key={i} className="flex justify-between p-3.5 bg-adworks-bg rounded-[1.2rem] text-[10px] font-black text-adworks-muted uppercase group hover:bg-adworks-blueTint hover:text-adworks-blue transition-all cursor-default">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                   </div>
                   <span>{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* LINHA 4: PIPELINE OPERACIONAL (6 cols) + FINANCEIRO (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
           <div className="flex items-center justify-between mb-8 border-b border-adworks-border pb-4">
              <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">Pipeline Operacional</h3>
              <button onClick={() => navigate('/operator/tasks')} className="text-[10px] font-black uppercase text-adworks-blue hover:underline">Abrir Pipeline</button>
           </div>
           <div className="space-y-6 flex-1">
              {[
                { stage: 'Triagem / Documentos', days: '2.5d', conv: '92%', color: 'w-[92%]' },
                { stage: 'Abertura na Junta', days: '8.1d', conv: '85%', color: 'w-[85%]' },
                { stage: 'Inscrição Municipal', days: '1.4d', conv: '98%', color: 'w-[98%]' },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-adworks-muted">{s.stage}</span>
                      <span className="text-adworks-dark">{s.days} • {s.conv}</span>
                   </div>
                   <div className="h-2 w-full bg-adworks-bg rounded-full overflow-hidden">
                      <div className={`bg-adworks-blue h-full ${s.color}`} />
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-4 border-t border-adworks-border border-dashed">
              <p className="text-[10px] font-bold text-status-danger uppercase tracking-tighter flex items-center gap-1.5 animate-pulse">
                 <AlertTriangle className="w-3 h-3" /> Gargalo: Abertura na Junta
              </p>
           </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
           <div className="flex items-center justify-between mb-8 border-b border-adworks-border pb-4">
              <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">Financeiro Rápido</h3>
              <button onClick={() => navigate('/client/finance')} className="text-[10px] font-black uppercase text-adworks-blue hover:underline">Abrir Financeiro</button>
           </div>
           <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-adworks-bg rounded-3xl border border-transparent hover:border-adworks-blue/10 transition-all">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-1">A Receber (30d)</p>
                 <p className="text-xl font-black text-adworks-dark italic tracking-tighter">R$ 142.4k</p>
              </div>
              <div className="p-6 bg-adworks-bg rounded-3xl border border-transparent hover:border-status-danger/10 transition-all">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-1 text-status-danger">A Pagar (30d)</p>
                 <p className="text-xl font-black text-adworks-dark italic tracking-tighter">R$ 58.2k</p>
              </div>
           </div>
           <div className="flex-1 bg-adworks-dark/5 rounded-[2rem] p-6 border border-white relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest">Caixa Previsto</p>
                 <TrendingUp className="w-4 h-4 text-status-success" />
              </div>
              <div className="h-[60px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MINI_SPARKLINE}>
                       <Line type="monotone" dataKey="v" stroke="#1E5BFF" strokeWidth={3} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* LINHA 5: TIME (4 cols) + MENSAGENS (4 cols) + QUICK ACTIONS (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
           <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest mb-8 italic leading-none">Time & Carga</h3>
           <div className="space-y-5 flex-1">
              {[
                { name: 'Matheus Grao', tasks: 12, status: 'Online', sla: '1.2d' },
                { name: 'Dan Mazzucatto', tasks: 3, status: 'Online', sla: '0.8d' },
                { name: 'Sah AI', tasks: 0, status: 'Active', sla: '0.1d' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-adworks-accent rounded-full flex items-center justify-center font-black text-[10px] text-adworks-blue border border-adworks-border">{m.name.charAt(0)}</div>
                      <div>
                         <p className="text-[11px] font-bold text-adworks-dark leading-none">{m.name}</p>
                         <p className="text-[9px] font-black text-status-success uppercase mt-0.5">{m.status}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-adworks-muted uppercase leading-none">{m.tasks} DEALS</p>
                      <p className="text-[10px] font-black text-adworks-dark mt-1">SLA: {m.sla}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card flex flex-col">
           <div className="flex items-center justify-between mb-8 border-b border-adworks-border pb-4">
              <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">Mensagens</h3>
              <span className="bg-status-danger text-white px-2 py-0.5 rounded-md text-[9px] font-black">5 NOVAS</span>
           </div>
           <div className="space-y-4 flex-1">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-adworks-bg transition-colors cursor-pointer group">
                   <div className="w-10 h-10 bg-adworks-accent rounded-xl flex items-center justify-center text-adworks-muted group-hover:text-adworks-blue shadow-sm shrink-0">
                      <MessageSquare className="w-5 h-5" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-xs font-bold text-adworks-dark truncate">Restaurante Sabor & Arte</p>
                      <p className="text-[10px] text-adworks-muted truncate mt-0.5">Enviamos o protocolo do INPI...</p>
                   </div>
                </div>
              ))}
           </div>
           <button onClick={() => navigate('/operator/messages')} className="mt-6 w-full py-3 bg-adworks-bg rounded-xl text-[10px] font-black uppercase text-adworks-muted hover:bg-adworks-blue hover:text-white transition-all">Ver Todas</button>
        </div>

        <div className="lg:col-span-4 bg-[#0F1B2D] rounded-adw-lg p-8 text-white shadow-2xl flex flex-col">
           <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-8 italic flex items-center gap-2">
              <Zap className="w-4 h-4 text-adworks-blue" />
              Quick Actions
           </h3>
           <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { label: 'Novo Cliente', icon: Plus, path: '/operator/clients' },
                { label: 'Proposta', icon: FileText, path: '/operator/tasks' },
                { label: 'Carga Fiscal', icon: Target, path: '/operator/tickets/fiscal' },
                { icon: Globe, label: 'Criar Site', path: '/operator/site' },
              ].map((act, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(act.path)}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-adworks-blue hover:border-adworks-blue transition-all group flex flex-col items-center justify-center gap-2"
                >
                   <act.icon className="w-5 h-5 text-adworks-blue group-hover:text-white" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{act.label}</span>
                </button>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
