import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Zap,
  CreditCard
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
  const navigate = useNavigate();
  const [progress, setProgress] = useState<OnboardingProgress>({ total: 12, completed: 0, percentage: 0 });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
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
      const [stepsRes, ticketRes, subRes] = await Promise.all([
        supabase.from('onboarding_steps').select('*').eq('client_id', currentClientId),
        supabase.from('tickets').select('*').eq('client_id', currentClientId).order('created_at', { ascending: false }).limit(3),
        supabase.from('subscriptions').select('*, plan:plans(*)').eq('client_id', currentClientId).maybeSingle()
      ]);

      if (stepsRes.data) {
        const completed = stepsRes.data.filter(s => s.status === 'APPROVED').length;
        setProgress({
          total: 12,
          completed,
          percentage: Math.round((completed / 12) * 100),
        });
      }

      if (ticketRes.data) setTickets(ticketRes.data);
      if (subRes.data) setSubscription(subRes.data);
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Busca o plano básico por padrão se não tiver nada
    const { data: plans } = await supabase.from('plans').select('id').limit(1).single();
    if (!plans) return;

    setLoading(true);
    const { data, error } = await supabase.functions.invoke('subscription-engine', {
      body: { clientId: currentClientId, planId: plans.id }
    });

    if (data?.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert('Erro ao gerar checkout. Tente novamente mais tarde.');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'WAITING_CLIENT': return 'bg-yellow-100 text-yellow-700';
      case 'DONE':
      case 'APPROVED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Onboarding Column */}
        <div className="lg:col-span-8 space-y-8">
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
                  className="bg-white h-full transition-all duration-1000 ease-out shadow-lg"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Clock className="w-3.5 h-3.5" /> 15 DIAS RESTANTES
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marca</p>
                  <p className="text-lg font-black text-adworks-dark italic uppercase">Protegida</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400">INPI Protocolado</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-adw-soft border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Domínio</p>
                  <p className="text-lg font-black text-adworks-dark italic uppercase">Online</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400">Reserva Concluída</p>
            </div>
          </div>
        </div>

        {/* Sidebar / Revenue Column */}
        <div className="lg:col-span-4 space-y-8">
           {/* Billing Card */}
           {!subscription || subscription.status !== 'ACTIVE' ? (
             <div className="bg-adworks-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-600/30 transition-all"></div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-orange-500" />
                  ATIVAÇÃO
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 italic">
                  "Ative sua assinatura para liberar o processamento do seu CNPJ pela nossa equipe."
                </p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  ASSINAR PLANO
                </button>
             </div>
           ) : (
             <div className="bg-adworks-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-green-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  PLANO ATIVO
                </h3>
                <p className="text-gray-400 text-sm font-black uppercase tracking-widest mb-1 italic">{subscription.plan?.name}</p>
                <p className="text-adworks-accent text-2xl font-black tracking-tighter">R$ {subscription.plan?.price}/mês</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Próximo: 10/03</span>
                   <Link to="/client/account" className="text-[10px] font-black text-adworks-blue hover:underline uppercase">Gerenciar</Link>
                </div>
             </div>
           )}

           <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
              <h3 className="text-xl font-black text-adworks-dark uppercase italic mb-8 tracking-tight flex items-center gap-3">
                 <AlertCircle className="w-6 h-6 text-orange-500" />
                 Próximas ações
              </h3>
              <div className="space-y-4">
                 {/* Exemplo de tarefa de ativação se não estiver pago */}
                 {(!subscription || subscription.status !== 'ACTIVE') && (
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                       <p className="font-black text-orange-700 uppercase text-xs italic mb-1">Pagamento Pendente</p>
                       <p className="text-xs font-bold text-orange-600">Aguardando ativação do plano.</p>
                    </div>
                 )}
                 <div className="p-6 bg-adworks-gray/50 rounded-3xl opacity-60">
                    <p className="font-black text-gray-500 uppercase text-xs italic mb-1">Aguardando validação</p>
                    <p className="text-xs font-medium text-gray-400">Arquivos em análise.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
