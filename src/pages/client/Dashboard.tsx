import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Globe,
  Mail,
  Briefcase,
  Building2,
} from 'lucide-react';

interface OnboardingProgress {
  total: number;
  completed: number;
  percentage: number;
}

interface Ticket {
  id: string;
  type: string;
  status: string;
  created_at: string;
}

export function Dashboard() {
  const { currentClientId } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress>({ total: 12, completed: 0, percentage: 0 });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentClientId) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentClientId]);

  const loadDashboardData = async () => {
    if (!currentClientId) return;

    try {
      const { data: steps, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('client_id', currentClientId);

      if (steps) {
        const completed = steps.filter(s => s.status === 'APPROVED').length;
        const total = 12;
        setProgress({
          total,
          completed,
          percentage: Math.round((completed / total) * 100),
        });
      }

      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', currentClientId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (ticketData) {
        setTickets(ticketData);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'WAITING_CLIENT':
        return 'bg-yellow-100 text-yellow-700';
      case 'DONE':
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'NEW': 'Novo',
      'WAITING_CLIENT': 'Aguardando você',
      'READY': 'Pronto',
      'IN_PROGRESS': 'Em andamento',
      'SUBMITTED': 'Enviado',
      'PENDING_EXTERNAL': 'Aguardando aprovação externa',
      'APPROVED': 'Aprovado',
      'REJECTED': 'Rejeitado',
      'DONE': 'Concluído',
    };
    return labels[status] || status;
  };

  const getTicketTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TICKET_CNPJ': 'CNPJ',
      'TICKET_INPI': 'Registro de Marca',
      'TICKET_FISCAL': 'Fiscal',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Início
          </h1>
          <p className="text-gray-500 font-medium">Acompanhe o progresso da sua empresa</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-adw-soft">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Sistema Online</span>
        </div>
      </div>

      <div className="bg-adworks-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-adworks-blue/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Sua empresa está {progress.percentage}% pronta</h2>
              <p className="text-blue-100 mt-1 font-medium italic opacity-80">Finalize o onboarding para iniciarmos o CNPJ.</p>
            </div>
            <div className="text-6xl font-black tracking-tighter">{progress.percentage}%</div>
          </div>
          <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-md p-1">
            <div
              className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="mt-10">
            <Link
              to="/client/onboarding"
              className="inline-flex items-center space-x-3 bg-white text-adworks-blue px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
            >
              <span>CONTINUAR CADASTRO</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/20 transition-all group">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
              <Building2 className="w-8 h-8 text-adworks-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CNPJ</p>
              <p className="text-lg font-black text-adworks-dark italic">EM PROCESSO</p>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 15 DIAS ÚTEIS RESTANTES
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marca</p>
              <p className="text-lg font-black text-adworks-dark italic uppercase">Aguardando</p>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400">Solicitação pendente</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Domínio</p>
              <p className="text-lg font-black text-adworks-dark italic uppercase">Pendente</p>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400">Escolha seu domínio</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
              <p className="text-lg font-black text-adworks-dark italic uppercase">Pendente</p>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400">Configure seu email</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
          <h3 className="text-xl font-black text-adworks-dark uppercase italic mb-8 tracking-tight flex items-center gap-3">
             <AlertCircle className="w-6 h-6 text-orange-500" />
             Próximas ações
          </h3>
          <div className="space-y-4">
            <Link
              to="/client/onboarding"
              className="flex items-center justify-between p-6 bg-adworks-gray rounded-3xl border border-transparent hover:border-adworks-blue transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-adworks-dark uppercase text-sm italic">Complete seu cadastro</p>
                  <p className="text-xs font-medium text-gray-500">Existem etapas obrigatórias pendentes</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-adworks-blue group-hover:translate-x-1 transition-all" />
            </Link>

            <div className="flex items-center justify-between p-6 bg-adworks-gray/50 rounded-3xl opacity-60">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400">
                    <Clock className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-black text-gray-500 uppercase text-sm italic">Aguardando validação</p>
                    <p className="text-xs font-medium text-gray-400">Nossa equipe está conferindo os arquivos</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-adworks-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/20 transition-all"></div>
          <h3 className="text-xl font-black uppercase italic mb-8 tracking-tight">Acompanhamento</h3>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-10 italic text-sm font-medium">Nenhum processo em andamento no momento.</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-adworks-accent">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm italic tracking-tight">{getTicketTypeLabel(ticket.type)}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                        Iniciado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
