import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Target,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calendar,
  ChevronDown,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileText,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  MessageSquare,
  Activity,
  Plus,
  LayoutGrid,
} from 'lucide-react';

// --- SHARED UI COMPONENTS (INLINED FOR DRASTIC REBUILD) ---

const BadgeStatus = ({
  variant,
  children,
}: {
  variant: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}) => {
  const styles = {
    success: 'bg-[#EAF7EF] text-[#16A34A] border-[#DCFCE7]',
    warning: 'bg-[#FFF4E5] text-[#F59E0B] border-[#FEF3C7]',
    danger: 'bg-[#FFECEC] text-[#EF4444] border-[#FEE2E2]',
    info: 'bg-[#E8F6FE] text-[#0EA5E9] border-[#DBEAFE]',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  delta,
  isUp,
}: {
  label: string;
  value: string;
  delta: string;
  isUp: boolean;
}) => (
  <div className="bg-white p-5 rounded-[14px] border border-[#E6E9F2] shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] font-bold text-[#5B667A] uppercase tracking-widest">{label}</p>
      <div
        className={`flex items-center gap-0.5 text-[10px] font-black ${isUp ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}
      >
        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {delta}
      </div>
    </div>
    <h4 className="text-2xl font-bold text-[#0B1220] tracking-tighter">{value}</h4>
    <button className="mt-3 text-[10px] font-black text-[#1E5BFF] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
      Detalhes
    </button>
  </div>
);

// --- MAIN PAGE ---

export function AdworksDashboard() {
  const navigate = useNavigate();

  const CORE_STAGES = [
    { label: 'CNPJ', icon: Building2, count: 24, delay: 2 },
    { label: 'Domínio', icon: Globe, count: 12, delay: 0 },
    { label: 'Email', icon: Mail, count: 8, delay: 1 },
    { label: 'Site', icon: LayoutIcon, count: 15, delay: 3 },
    { label: 'Marca', icon: Award, count: 6, delay: 0 },
    { label: 'Contábil', icon: FileText, count: 42, delay: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-full">
      {/* A) PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E6E9F2]">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1220] tracking-tight">Command Center</h1>
          <p className="text-[#5B667A] text-sm font-medium">
            Operação, performance e alertas em tempo real
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B667A]" />
            <input
              type="text"
              placeholder="Busca global..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E6E9F2] rounded-[10px] text-sm focus:ring-1 focus:ring-[#1E5BFF] outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E6E9F2] rounded-[10px] px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50">
            <Calendar className="w-4 h-4 text-[#5B667A] mr-1" />
            <span className="text-xs font-bold text-[#0B1220] uppercase tracking-wider">
              Fevereiro 2026
            </span>
          </div>
          <button className="bg-[#1E5BFF] text-white px-5 py-2 rounded-[10px] text-xs font-bold shadow-lg shadow-[#1E5BFF]/20 hover:brightness-110 flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" /> Novo Cliente
          </button>
          <button
            onClick={() => navigate('/admin/tasks')}
            className="bg-[#0B1220] text-white px-5 py-2 rounded-[10px] text-xs font-bold shadow-md hover:bg-slate-800 flex items-center gap-2 transition-all"
          >
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
        </div>
      </div>

      {/* B) LINHA 1: KPI CARDS COMPACTOS (8 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <StatCard label="Clientes Ativos" value="1.240" delta="12%" isUp={true} />
        <StatCard label="Em Risco (SLA)" value="14" delta="2" isUp={false} />
        <StatCard label="Aguard. Cliente" value="32" delta="5%" isUp={true} />
        <StatCard label="Tarefas Hoje" value="45" delta="8%" isUp={true} />
        <StatCard label="Revenue/Pipe" value="R$ 5.2M" delta="16%" isUp={true} />
        <StatCard label="Ticket Médio" value="R$ 3.2k" delta="R$ 150" isUp={true} />
        <StatCard label="Win Rate" value="16.9%" delta="2%" isUp={true} />
        <StatCard label="SLA Médio" value="12.5d" delta="1.2d" isUp={true} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* C) LINHA 2 ESQUERDA: PIPELINE POR ETAPA (65%) */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-[14px] border border-[#E6E9F2] shadow-adw-card h-full">
            <div className="p-6 border-b border-[#F6F7FB] flex items-center justify-between">
              <h3 className="font-bold text-[#0B1220] text-sm uppercase tracking-widest italic">
                Pipeline por Etapa
              </h3>
              <BadgeStatus variant="info">Fluxo Operacional</BadgeStatus>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {CORE_STAGES.map((stage, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#F6F7FB] rounded-xl border border-transparent hover:border-[#1E5BFF]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#5B667A] group-hover:text-[#1E5BFF] shadow-sm transition-colors">
                      <stage.icon className="w-5 h-5" />
                    </div>
                    {stage.delay > 0 && (
                      <span className="text-[9px] font-black text-[#EF4444] animate-pulse">
                        ! {stage.delay} ATRASADOS
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-[#5B667A] uppercase tracking-tighter">
                    {stage.label}
                  </p>
                  <div className="flex items-end justify-between mt-1">
                    <h4 className="text-2xl font-bold text-[#0B1220] tracking-tighter">
                      {stage.count}
                    </h4>
                    <button className="text-[9px] font-black text-[#1E5BFF] hover:underline uppercase">
                      Ver Fila
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-[#FFF4E5]/20 border-t border-[#F6F7FB] flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <p className="text-[10px] font-bold text-[#92400E] uppercase tracking-widest">
                Gargalo Crítico:{' '}
                <span className="font-black underline italic ml-1">CONTABILIDADE</span> (Média 5.2
                dias acima do SLA)
              </p>
            </div>
          </div>
        </div>

        {/* C) LINHA 2 DIREITA: HOJE + INSIGHTS (35%) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[14px] border border-[#E6E9F2] shadow-adw-card flex flex-col">
            <div className="p-6 border-b border-[#F6F7FB] bg-[#F6F7FB]/50 flex items-center justify-between">
              <h3 className="font-bold text-[#0B1220] text-[11px] tracking-widest uppercase italic">
                Hoje
              </h3>
              <Zap className="w-4 h-4 text-[#1E5BFF]" />
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: 'Follow-ups vencidos', count: 12, variant: 'danger' },
                { label: 'Documentos Inválidos', count: 8, variant: 'danger' },
                { label: 'SLA estourando < 24h', count: 3, variant: 'warning' },
                { label: 'Tickets WAITING_CLIENT', count: 15, variant: 'info' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#F6F7FB] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.variant === 'danger' ? 'bg-[#EF4444]' : item.variant === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#0EA5E9]'}`}
                    />
                    <span className="text-sm font-semibold text-[#5B667A] group-hover:text-[#0B1220]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-black ${item.variant === 'danger' ? 'text-[#EF4444]' : item.variant === 'warning' ? 'text-[#F59E0B]' : 'text-[#0EA5E9]'}`}
                    >
                      {item.count}
                    </span>
                    <button className="text-[9px] font-black uppercase text-[#1E5BFF] hover:underline whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Resolver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#E8F6FE] p-5 rounded-xl border border-[#DBEAFE] flex items-center gap-4 group cursor-pointer hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0EA5E9] shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#1E40AF] uppercase">Insight</p>
                <p className="text-xs font-bold text-[#1E40AF]">SLA de Marcas subiu 12%</p>
              </div>
            </div>
            <div className="bg-[#FFF4E5] p-5 rounded-xl border border-[#FEF3C7] flex items-center gap-4 group cursor-pointer hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#F59E0B] shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#92400E] uppercase">Atenção</p>
                <p className="text-xs font-bold text-[#92400E]">12 Clientes sem atividade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D) LINHA 3: ATIVIDADE + MENSAGENS (50/50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="bg-white rounded-[14px] border border-[#E6E9F2] shadow-adw-card">
          <div className="p-6 border-b border-[#F6F7FB] flex items-center justify-between">
            <h3 className="font-bold text-[#0B1220] text-[11px] tracking-widest uppercase italic">
              Atividade Recente
            </h3>
            <Activity className="w-4 h-4 text-[#5B667A] opacity-30" />
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 group cursor-default">
                <div className="w-8 h-8 bg-[#F6F7FB] rounded-lg flex items-center justify-center text-[10px] font-black text-[#5B667A] border border-[#E6E9F2] group-hover:bg-[#1E5BFF] group-hover:text-white transition-all">
                  MG
                </div>
                <div>
                  <p className="text-xs text-[#0B1220] leading-tight">
                    <span className="font-bold">Matheus</span> moveu{' '}
                    <span className="text-[#1E5BFF] font-black italic">Restaurante S&A</span> para{' '}
                    <span className="font-black italic text-[#16A34A]">CONTÁBIL</span>
                  </p>
                  <p className="text-[9px] font-bold text-[#5B667A] uppercase mt-1 tracking-widest opacity-60">
                    Há 12 minutos • Automático
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full p-4 border-t border-[#F6F7FB] text-[9px] font-black uppercase text-[#5B667A] hover:text-[#1E5BFF] transition-colors">
            Ver log completo
          </button>
        </div>

        <div className="bg-white rounded-[14px] border border-[#E6E9F2] shadow-adw-card">
          <div className="p-6 border-b border-[#F6F7FB] flex items-center justify-between">
            <h3 className="font-bold text-[#0B1220] text-[11px] tracking-widest uppercase italic">
              Mensagens Recentes
            </h3>
            <MessageSquare className="w-4 h-4 text-[#5B667A] opacity-30" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-[#F6F7FB]/50 rounded-xl hover:bg-[#F6F7FB] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#5B667A] group-hover:text-[#1E5BFF] shadow-sm transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0B1220] uppercase truncate">
                      Restaurante Sabor & Arte
                    </p>
                    <p className="text-[10px] text-[#5B667A] truncate mt-0.5">
                      Enviamos o protocolo da Junta...
                    </p>
                  </div>
                </div>
                <BadgeStatus variant="info">NOVO</BadgeStatus>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/operator/messages')}
            className="w-full p-4 border-t border-[#F6F7FB] text-[9px] font-black uppercase text-[#5B667A] hover:text-[#1E5BFF] transition-colors"
          >
            Ir para o correio global
          </button>
        </div>
      </div>
    </div>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
