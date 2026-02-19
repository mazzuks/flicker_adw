import { useState, useEffect } from 'react';
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
  Activity
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
  Cell 
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

export function AdworksDashboard() {
  const [timeRange, setTimeRange] = useState('mês');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
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
              placeholder="Busca global..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-adworks-border rounded-adw text-sm focus:ring-2 focus:ring-adworks-blue outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-adworks-border rounded-adw px-4 py-2 shadow-sm cursor-pointer hover:bg-adworks-bg transition-colors">
            <Calendar className="w-4 h-4 text-adworks-muted" />
            <span className="text-xs font-bold text-adworks-dark uppercase tracking-wider">{timeRange}</span>
            <ChevronDown className="w-3 h-3 text-adworks-muted ml-1" />
          </div>

          <div className="bg-white border border-adworks-border rounded-adw p-2 shadow-sm hover:bg-adworks-bg transition-colors cursor-pointer">
            <Filter className="w-4 h-4 text-adworks-muted" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BLOCO 1: HERO (8 cols) */}
        <div className="lg:col-span-8 bg-adworks-blue rounded-adw-lg p-8 text-white shadow-adw-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 pointer-events-none" />
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

        {/* BLOCO 1: SIDE CARDS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">Ticket Médio</p>
                <div className="flex items-center gap-1 text-[10px] font-black text-status-success">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </div>
              </div>
              <h4 className="text-3xl font-bold text-adworks-dark mt-3 tracking-tighter">R$ 3.250</h4>
            </div>
            <div className="h-1 w-full bg-adworks-bg rounded-full overflow-hidden mt-4">
              <div className="bg-adworks-blue h-full w-[70%]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-adw-lg border border-adworks-border shadow-adw-card flex flex-col justify-between hover:border-adworks-blue/20 transition-all group flex-1">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest italic">SLA Médio</p>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-status-successTint text-status-success border border-status-success/10 uppercase">Em Risco</span>
              </div>
              <h4 className="text-3xl font-bold text-adworks-dark mt-3 tracking-tighter">12.5 d</h4>
            </div>
            <p className="text-[9px] font-bold text-adworks-muted mt-4 uppercase tracking-wider italic">-1.2 dias vs Jan</p>
          </div>
        </div>

        {/* BLOCO 2: ATENÇÃO HOJE (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
          <div className="p-6 border-b border-adworks-border flex items-center justify-between bg-adworks-bg/30">
            <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">Atenção Hoje</h3>
            <Activity className="w-4 h-4 text-adworks-muted opacity-30" />
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: 'Follow-ups vencidos', count: 12, type: 'danger', cta: 'Ver agora' },
              { label: 'Negócios parados > 7 dias', count: 8, type: 'warning', cta: 'Reativar' },
              { label: 'Propostas sem resposta', count: 24, type: 'info', cta: 'C cobrar' },
              { label: 'Pendências de documentos', count: 5, type: 'danger', cta: 'Auditar' },
              { label: 'SLA em risco iminente', count: 3, type: 'danger', cta: 'Priorizar' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-adworks-bg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'danger' ? 'bg-status-danger' : item.type === 'warning' ? 'bg-status-warning' : 'bg-status-info'}`} />
                  <span className="text-sm font-bold text-adworks-muted group-hover:text-adworks-dark">{item.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black ${item.type === 'danger' ? 'text-status-danger' : item.type === 'warning' ? 'text-status-warning' : 'text-status-info'}`}>{item.count}</span>
                  <button className="text-[10px] font-black uppercase text-adworks-blue hover:underline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCO 2: PRÓXIMAS AÇÕES (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-adw-lg border border-adworks-border shadow-adw-card overflow-hidden">
          <div className="p-6 border-b border-adworks-border flex items-center justify-between bg-adworks-bg/30">
            <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">Próximas Ações</h3>
            <CheckCircle2 className="w-4 h-4 text-adworks-muted opacity-30" />
          </div>
          <div className="p-4">
            <table className="w-full text-left">
              <tbody className="divide-y divide-adworks-border">
                {[
                  { title: 'Aprovar Contrato Social', entity: 'Restaurante S&A', due: 'Hoje', status: 'critical' },
                  { title: 'Enviar Guia DAS Jan', entity: 'Clínica Sorriso', due: '14:30', status: 'normal' },
                  { title: 'Responder Ticket #9921', entity: 'Dona Helena', due: 'Amanhã', status: 'normal' },
                  { title: 'Validar Marca INPI', entity: 'Buffet Alegria', due: 'Hoje', status: 'urgent' },
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

        {/* BLOCO 3: PERFORMANCE CHART (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-adw-lg p-8 border border-adworks-border shadow-adw-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 border-b border-adworks-border pb-6">
            <div>
              <h3 className="text-xl font-bold text-adworks-dark tracking-tight uppercase italic leading-none">Fluxo de Performance Histórica</h3>
              <p className="text-adworks-muted text-[10px] font-black uppercase tracking-[0.2em] mt-3 italic">Métricas de Receita Realizada vs Meta</p>
            </div>
            <div className="flex bg-adworks-bg p-1 rounded-xl shadow-inner">
               {['Mês', 'Semana', 'Dia'].map(t => (
                 <button key={t} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm scale-105' : 'text-adworks-muted hover:text-adworks-dark'}`}>{t}</button>
               ))}
            </div>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA_HISTORY}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5BFF" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#1E5BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} dy={12} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px'}}
                    itemStyle={{fontWeight: '900', textTransform: 'uppercase', fontSize: '10px'}}
                  />
                  <Area type="monotone" dataKey="val" stroke="#1E5BFF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" activeDot={{ r: 8, fill: '#1E5BFF', strokeWidth: 4, stroke: '#fff' }} />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BLOCO 3: PIPELINE DONUT (4 cols) */}
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
                 <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest">Total Global</p>
                 <p className="text-4xl font-black text-adworks-dark tracking-tighter italic leading-none mt-1">1.0k</p>
              </div>
           </div>
           <div className="space-y-2.5 mt-10">
              {DATA_PIPELINE.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-adworks-bg rounded-[1.2rem] border border-transparent hover:border-adworks-border transition-all cursor-default">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-adworks-muted uppercase tracking-wider">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-adworks-dark">{item.value} ({Math.round(item.value/1000*100)}%)</span>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-adworks-border border-dashed">
                 <p className="text-[10px] font-bold text-status-danger uppercase tracking-tighter flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> Gargalo atual: Proposta Enviada
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
