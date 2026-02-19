import { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CORE_FLOW = [
  { id: 'cnpj', label: 'Abertura CNPJ', icon: Building2, color: 'blue' },
  { id: 'domain', label: 'Domínio', icon: Globe, color: 'purple' },
  { id: 'email', label: 'Email Corp', icon: Mail, color: 'indigo' },
  { id: 'site', label: 'Site Builder', icon: LayoutIcon, color: 'cyan' },
  { id: 'brand', label: 'Marca INPI', icon: Award, color: 'orange' },
  { id: 'accounting', label: 'Contabilidade', icon: FileText, color: 'green' },
];

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading)
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-20 bg-white rounded-xl w-1/3" />
        <div className="h-64 bg-white rounded-2xl" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-700">
      {/* 🏛️ TOP BAR: CENTRAL DE OPERAÇÕES */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-adworks-border">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none italic uppercase">
            Central de Operações
          </h1>
          <p className="text-adworks-muted text-xs font-bold uppercase tracking-widest mt-2">
            Performance e Alertas em Tempo Real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
            <input
              type="text"
              placeholder="Buscar cliente ou processo..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-adworks-border rounded-lg text-xs font-medium focus:ring-1 focus:ring-adworks-blue outline-none shadow-sm"
            />
          </div>
          <Button size="sm" variant="secondary" className="gap-2">
            <Plus className="w-3.5 h-3.5" /> NOVO CLIENTE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1️⃣ BLOCO "HOJE" (PRIORIDADE MÁXIMA) - 4 COLS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-l-4 border-l-status-danger" noPadding>
            <div className="p-6 border-b border-adworks-bg bg-adworks-bg/20 flex items-center justify-between">
              <h3 className="font-black text-adworks-dark text-[10px] tracking-widest uppercase italic">
                Atenção Crítica
              </h3>
              <Badge variant="danger">Ação Imediata</Badge>
            </div>
            <div className="p-2">
              {[
                { label: 'Tarefas Vencidas', count: 12, type: 'danger' },
                { label: 'Documentos Inválidos', count: 8, type: 'danger' },
                { label: 'Tickets Aguard. Cliente', count: 24, type: 'warning' },
                { label: 'Etapas Travadas > 48h', count: 3, type: 'danger' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-adworks-bg rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.type === 'danger' ? 'bg-status-danger shadow-[0_0_8px_#ef4444]' : 'bg-status-warning'}`}
                    />
                    <span className="text-sm font-bold text-adworks-muted group-hover:text-adworks-dark">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-black ${item.type === 'danger' ? 'text-status-danger' : 'text-status-warning'}`}
                    >
                      {item.count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-adworks-muted opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-adworks-dark text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/20 transition-all" />
            <div className="relative z-10">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 italic">
                SLA de Operação
              </p>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h4 className="text-3xl font-black tracking-tighter italic leading-none">
                    12.5 d
                  </h4>
                  <p className="text-[9px] font-bold text-green-400 uppercase tracking-tighter flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> -1.2d vs Jan
                  </p>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="bg-adworks-blue h-full w-[65%]" />
                </div>
                <p className="text-[10px] font-medium text-white/60">
                  Média global de entrega Empresa Pronta.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 2️⃣ BLOCO "PIPELINE DE CLIENTES" - 8 COLS */}
        <div className="lg:col-span-8 space-y-6">
          <Card noPadding>
            <div className="p-6 border-b border-adworks-bg bg-adworks-bg/10 flex items-center justify-between">
              <h3 className="font-black text-adworks-dark text-[10px] tracking-widest uppercase italic leading-none">
                Pipeline Estratégico (Fluxo Core)
              </h3>
              <button
                onClick={() => navigate('/operator/tasks')}
                className="text-[9px] font-black text-adworks-blue hover:underline uppercase tracking-widest"
              >
                Abrir Kanban Full
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CORE_FLOW.map((step) => (
                <div
                  key={step.id}
                  className="p-4 bg-adworks-bg/50 rounded-2xl border border-transparent hover:border-adworks-border transition-all group text-center cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center text-adworks-muted group-hover:text-adworks-blue shadow-sm transition-all group-hover:scale-110">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-black text-adworks-dark uppercase tracking-tight leading-tight">
                    {step.label}
                  </p>
                  <h4 className="text-lg font-black text-adworks-dark mt-1 tracking-tighter">24</h4>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#FFF4E5]/30 border-t border-adworks-bg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <p className="text-[10px] font-bold text-status-warning uppercase tracking-widest leading-none">
                  Gargalo Identificado:{' '}
                  <span className="font-black underline italic ml-1 text-adworks-dark">
                    ABERTURA DE CNPJ (JUNTA)
                  </span>
                </p>
              </div>
              <span className="text-[9px] font-black text-adworks-muted uppercase">
                8.1 dias de média
              </span>
            </div>
          </Card>

          {/* 4️⃣ BLOCO COMERCIAL / FINANCEIRO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-adworks-blue/20 transition-all cursor-pointer">
              <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-1">
                Receita Prevista
              </p>
              <h4 className="text-2xl font-black text-adworks-dark italic">R$ 142.4k</h4>
              <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                +12.5%
              </div>
            </Card>
            <Card className="hover:border-adworks-blue/20 transition-all cursor-pointer">
              <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mb-1">
                Novos Clientes
              </p>
              <h4 className="text-2xl font-black text-adworks-dark italic">45</h4>
              <p className="text-[9px] font-bold text-adworks-muted uppercase mt-3">Meta: 60/mês</p>
            </Card>
            <Card className="bg-adworks-blue text-white shadow-xl shadow-blue-500/20 hover:brightness-110 transition-all cursor-pointer">
              <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">
                Valor em Pipeline
              </p>
              <h4 className="text-2xl font-black italic tracking-tighter">R$ 5.2M</h4>
              <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[45%]" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* LINHA 3: PERFORMANCE HISTÓRICA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card noPadding>
            <div className="p-8 border-b border-adworks-bg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-adworks-dark uppercase italic tracking-tighter">
                  Performance de Receita
                </h3>
                <p className="text-adworks-muted text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
                  Realizado vs Meta Anterior
                </p>
              </div>
              <div className="flex bg-adworks-bg p-1 rounded-xl">
                {['DIA', 'SEMANA', 'MÊS'].map((t) => (
                  <button
                    key={t}
                    className={`px-5 py-2 rounded-lg text-[9px] font-black transition-all ${t === 'MÊS' ? 'bg-white text-adworks-blue shadow-sm' : 'text-adworks-muted'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full p-8 pr-12">
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
                      borderRadius: '16px',
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

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex-1">
            <h3 className="text-sm font-black text-adworks-dark uppercase tracking-widest italic mb-6">
              Origem dos Clientes
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Google Ads', val: '45%', color: 'bg-blue-500' },
                { label: 'Orgânico', val: '30%', color: 'bg-indigo-500' },
                { label: 'Instagram', val: '15%', color: 'bg-purple-500' },
                { label: 'Indicação', val: '10%', color: 'bg-green-500' },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-adworks-muted">{s.label}</span>
                    <span className="text-adworks-dark">{s.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-adworks-bg rounded-full overflow-hidden">
                    <div className={`${s.color} h-full`} style={{ width: s.val }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#0F1B2D] text-white flex flex-col items-center justify-center p-10 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mb-16 blur-2xl group-hover:bg-orange-600/20 transition-all duration-700" />
            <Zap className="w-10 h-10 text-adworks-blue fill-adworks-blue mb-4 animate-pulse" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">AI INSIGHT</h3>
            <p className="text-[10px] text-white/40 text-center uppercase tracking-widest mt-2 leading-relaxed">
              Sua conversão de marcas INPI cresceu 25% este mês.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
