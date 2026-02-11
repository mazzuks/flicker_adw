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
  const [progress, setProgress] = useState<OnboardingProgress>({ total: 0, completed: 0, percentage: 0 });
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

    const { data: steps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('client_id', currentClientId);

    if (steps) {
      const completed = steps.filter(s => s.status === 'APPROVED').length;
      const total = Math.max(steps.length, 12);
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

    setLoading(false);
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium">Bem-vindo ao centro de comando da sua empresa.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-adw-soft">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Live Operations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Progress Card */}
          <div className="bg-adworks-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-adworks-blue/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-adworks-accent/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-sm font-black text-blue-200 uppercase tracking-[0.2em] mb-2">Progresso de Abertura</h2>
                  <h3 className="text-5xl font-black tracking-tighter">
                    {progress.percentage}% <span className="text-2xl text-blue-200 font-bold ml-2">concluído</span>
                  </h3>
                </div>
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-full h-6 p-1.5 mb-8 border border-white/10">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center justify-center space-x-3 bg-white text-adworks-blue px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-all active:scale-95 shadow-xl"
                >
                  <span>Avançar agora</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center space-x-2 text-blue-100 px-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Tempo médio: 15 dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'CNPJ', icon: FileText, color: 'blue', status: 'Em análise', value: '15d' },
              { label: 'DOMÍNIO', icon: Globe, color: 'yellow', status: 'Pendente', value: 'Setup' },
              { label: 'MARCA', icon: Briefcase, color: 'green', status: 'Pronto', value: 'INPI' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/20 transition-all group cursor-pointer">
                <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                <h4 className="text-lg font-black text-adworks-dark">{item.status}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Style Action Center */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-adw-soft border border-gray-100">
            <h3 className="text-xl font-black text-adworks-dark mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-adworks-blue" />
              URGENTE
            </h3>
            <div className="space-y-4">
              <Link
                to="/onboarding"
                className="block p-5 bg-adworks-gray rounded-3xl border-2 border-dashed border-gray-200 hover:border-adworks-blue hover:bg-white transition-all group"
              >
                <p className="text-xs font-black text-adworks-blue uppercase mb-1">Onboarding</p>
                <p className="text-sm font-bold text-gray-800 group-hover:text-adworks-blue transition-colors">Complete seu cadastro para liberar o CNPJ</p>
              </Link>
            </div>
          </div>

          <div className="bg-adworks-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-xl font-black mb-6 relative z-10">Acompanhamento</h3>
            <div className="space-y-4 relative z-10">
              {tickets.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Nenhum processo ativo...</p>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-adworks-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tighter text-gray-400">{getTicketTypeLabel(ticket.type)}</p>
                        <p className="text-sm font-bold">{getStatusLabel(ticket.status)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
