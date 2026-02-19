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
  Command,
  Plus,
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
} from 'recharts';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const DATA_HISTORY = [
  { name: 'Set', val: 2400 },
  { name: 'Out', val: 3200 },
  { name: 'Nov', val: 2800 },
  { name: 'Dez', val: 4500 },
  { name: 'Jan', val: 4200 },
  { name: 'Fev', val: 5800 },
];

const DATA_PIPELINE = [
  { name: 'Entrada', value: 400, color: '#1E5BFF' },
  { name: 'Proposta', value: 300, color: '#8B5CF6' },
  { name: 'Negociação', value: 200, color: '#10B981' },
  { name: 'Ganho', value: 100, color: '#F59E0B' },
];

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento para UX de skeleton/fade
    setTimeout(() => setLoading(false), 600);
  }, []);

  if (loading)
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-20 bg-white rounded-xl w-1/3" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 bg-white rounded-xl" />
          <div className="h-32 bg-white rounded-xl" />
          <div className="h-32 bg-white rounded-xl" />
          <div className="h-32 bg-white rounded-xl" />
        </div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-20">
      {/* 🏛️ HEADER DA PÁGINA (Enterprise Standard) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-adworks-border">
        <div className="space-y-1">
          <h1 className="text-[28px] font-semibold text-adworks-dark tracking-tight">
            Command Center
          </h1>
          <p className="text-adworks-muted text-sm font-medium">
            Operação, performance e alertas em tempo real
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted opacity-50" />
            <input
              type="text"
              placeholder="Busca global... (⌘K)"
              className="w-full pl-11 pr-4 py-2 bg-white border border-adworks-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-adworks-blue outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-adworks-border rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-adworks-bg transition-colors">
            <Calendar className="w-4 h-4 text-adworks-muted mr-1" />
            <span className="text-xs font-semibold text-adworks-dark uppercase tracking-wider">
              Fevereiro 2026
            </span>
          </div>
          <Button size="md" className="gap-2">
            <Zap className="w-3.5 h-3.5" /> Ações
          </Button>
        </div>
      </div>

      {/* ROW KPIs: Compactos & Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Global', val: 'R$ 5.2M', delta: '+12%', type: 'info' },
          { label: 'Ticket Médio', val: 'R$ 3.250', delta: '+R$ 150', type: 'success' },
          { label: 'Active Deals', val: '1.624', delta: '↑ 45', type: 'info' },
          { label: 'SLA Médio', val: '12.5 d', delta: '-1.2d', type: 'danger' },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="flex flex-col justify-between hover:border-adworks-blue/20 transition-all group"
          >
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-black text-adworks-muted uppercase tracking-widest">
                {kpi.label}
              </p>
              <Badge variant={kpi.type as any}>{kpi.delta}</Badge>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <h4 className="text-[32px] font-bold text-adworks-dark leading-none tracking-tighter">
                {kpi.val}
              </h4>
              <button className="text-[10px] font-black text-adworks-blue uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Detalhes
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ALERTAS & AÇÕES (6 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="flex flex-col" noPadding>
            <div className="p-6 border-b border-adworks-border flex items-center justify-between">
              <h3 className="font-bold text-adworks-dark text-sm uppercase tracking-widest italic">
                Atenção Hoje
              </h3>
              <Badge variant="danger">5 CRÍTICOS</Badge>
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: 'Follow-ups vencidos', count: 12, variant: 'danger' },
                { label: 'Docs Inválidos', count: 8, variant: 'danger' },
                { label: 'SLA estourando', count: 3, variant: 'warning' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-adworks-bg transition-colors group"
                >
                  <span className="text-sm font-semibold text-adworks-muted group-hover:text-adworks-dark">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black text-status-${item.variant}`}>
                      {item.count}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-adworks-blue opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <button className="p-4 text-[9px] font-black text-adworks-muted border-t border-adworks-border hover:text-adworks-blue uppercase tracking-widest">
              Ver todos os alertas
            </button>
          </Card>

          <Card className="bg-adworks-dark text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4 italic">
                Activity Stream
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 text-xs leading-snug">
                    <div className="w-1.5 h-1.5 bg-adworks-blue rounded-full mt-1.5 shrink-0" />
                    <p>
                      <span className="font-bold">Matheus</span> aprovou Contrato Social de{' '}
                      <span className="text-adworks-blue font-black italic">Restaurante S&A</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* PERFORMANCE CHART (8 cols) */}
        <div className="lg:col-span-8">
          <Card noPadding>
            <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-adworks-bg pb-8">
              <div>
                <h3 className="text-lg font-bold text-adworks-dark uppercase italic tracking-tighter">
                  Performance Histórica
                </h3>
                <p className="text-adworks-muted text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  Métricas de Receita • 12 Meses
                </p>
              </div>
              <div className="flex bg-adworks-bg p-1 rounded-lg border border-white">
                {['Mês', 'Semana', 'Dia'].map((t) => (
                  <button
                    key={t}
                    className={`px-5 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${t === 'Mês' ? 'bg-white text-adworks-blue shadow-sm' : 'text-adworks-muted hover:text-adworks-dark'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-10 h-[420px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_HISTORY}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5BFF" stopOpacity={0.06} />
                      <stop offset="95%" stopColor="#1E5BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: '900' }}
                    dy={12}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                      padding: '20px',
                    }}
                    itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#1E5BFF"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                    activeDot={{ r: 8, fill: '#1E5BFF', strokeWidth: 4, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
