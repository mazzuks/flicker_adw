import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Calendar,
} from 'lucide-react';

interface Task {
  id: string;
  type: 'document' | 'onboarding' | 'ticket_message';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  action: string;
  actionUrl: string;
  entityId?: string;
}

export function Tasks() {
  const { currentClientId } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentClientId) {
      loadTasks();
    }
  }, [currentClientId]);

  const loadTasks = async () => {
    if (!currentClientId) return;

    const allTasks: Task[] = [];

    const { data: invalidDocs } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', currentClientId)
      .eq('status', 'INVALID');

    if (invalidDocs) {
      invalidDocs.forEach((doc) => {
        allTasks.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: 'Reenviar documento',
          description: `O documento "${doc.filename}" precisa ser reenviado`,
          priority: 'high',
          action: 'Enviar agora',
          actionUrl: '/documents',
          entityId: doc.id,
        });
      });
    }

    const { data: pendingSteps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('client_id', currentClientId)
      .in('status', ['NOT_STARTED', 'NEEDS_FIX']);

    if (pendingSteps) {
      const stepLabels: Record<string, string> = {
        company_data: 'Dados da Empresa',
        address: 'Endereço',
        partners: 'Sócios',
        activity: 'Atividade',
        taxes: 'Impostos',
        documents: 'Documentos',
        certificate: 'Certificado Digital',
        domain: 'Domínio',
        email: 'Email Corporativo',
        site: 'Site',
        brand: 'Marca',
        crm: 'CRM',
      };

      pendingSteps.forEach((step) => {
        allTasks.push({
          id: `step-${step.id}`,
          type: 'onboarding',
          title: 'Complete o cadastro',
          description: `Etapa pendente: ${stepLabels[step.step_key] || step.step_key}`,
          priority: 'medium',
          action: 'Continuar',
          actionUrl: '/onboarding',
          entityId: step.id,
        });
      });
    }

    const { data: waitingTickets } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('client_id', currentClientId)
      .eq('status', 'WAITING_CLIENT');

    if (waitingTickets) {
      waitingTickets.forEach((ticket) => {
        const typeLabels: Record<string, string> = {
          TICKET_CNPJ: 'Abertura de CNPJ',
          TICKET_INPI: 'Registro de Marca',
          TICKET_FISCAL: 'Fiscal',
        };

        allTasks.push({
          id: `ticket-${ticket.id}`,
          type: 'ticket_message',
          title: 'Resposta necessária',
          description: `${typeLabels[ticket.type] || 'Ticket'} aguardando sua resposta`,
          priority: 'high',
          dueDate: ticket.sla_due_at,
          action: 'Ver mensagem',
          actionUrl: '/inbox',
          entityId: ticket.id,
        });
      });
    }

    allTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setTasks(allTasks);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgente';
      case 'medium':
        return 'Normal';
      default:
        return 'Baixa';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'onboarding':
        return CheckCircle;
      case 'ticket_message':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Suas Tarefas</h1>
        <p className="text-gray-600 mt-1">
          {tasks.length === 0
            ? 'Parabéns! Você não tem tarefas pendentes'
            : `Você tem ${tasks.length} ${tasks.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tudo em dia!
          </h2>
          <p className="text-gray-600">
            Não há tarefas pendentes no momento. Continue acompanhando seu progresso no dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const Icon = getIcon(task.type);
            return (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {task.title}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      {task.dueDate && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(task.actionUrl)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 ml-4"
                  >
                    <span>{task.action}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
