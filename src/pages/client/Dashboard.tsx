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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Início</h1>
        <p className="text-gray-600 mt-1">Acompanhe o progresso da sua empresa</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Sua empresa está {progress.percentage}% pronta</h2>
            <p className="text-blue-100 mt-1">Continue o cadastro para finalizar</p>
          </div>
          <div className="text-4xl font-bold">{progress.percentage}%</div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className="mt-4">
          <Link
            to="/onboarding"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <span>Continuar cadastro</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CNPJ</p>
              <p className="text-lg font-bold text-gray-900">Em processo</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Previsão: 15 dias úteis</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Marca</p>
              <p className="text-lg font-bold text-gray-900">Não iniciado</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Aguardando início</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Domínio</p>
              <p className="text-lg font-bold text-gray-900">Pendente</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Escolha seu domínio</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-bold text-gray-900">Pendente</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Configure seu email</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Próximas ações</h3>
          <div className="space-y-3">
            <Link
              to="/onboarding"
              className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Complete seu cadastro</p>
                  <p className="text-sm text-gray-600">Faltam informações importantes</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Aguardando validação</p>
                  <p className="text-sm text-gray-600">Seus documentos estão sendo analisados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acompanhamento</h3>
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Nenhum processo em andamento</p>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{getTicketTypeLabel(ticket.type)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
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
