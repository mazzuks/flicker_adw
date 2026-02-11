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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Tarefas
          </h1>
          <p className="text-gray-500 font-medium">Ações necessárias para o seu CNPJ avançar.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-adw-soft border border-gray-100 flex items-center space-x-3">
          <span className="text-sm font-black text-adworks-blue">{tasks.length}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pendências</span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-adw-soft border border-gray-100 border-dashed">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-adworks-dark mb-2">Tudo em dia!</h2>
          <p className="text-gray-500 max-w-xs mx-auto">Nenhuma ação pendente no momento. Nossa equipe está trabalhando no seu processo.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 bg-adworks-blue text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const Icon = getIcon(task.type);
            const priorityColor = task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-adworks-blue';
            return (
              <div
                key={task.id}
                className="bg-white rounded-[2rem] p-8 shadow-adw-soft border border-gray-100 flex flex-col md:flex-row md:items-center justify-between group hover:border-adworks-blue/30 transition-all gap-6"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${priorityColor} bg-opacity-20 transition-transform group-hover:scale-110`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-black text-adworks-dark tracking-tight">{task.title}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${
                        task.priority === 'high' ? 'border-red-200 text-red-600 bg-red-50' : 'border-blue-200 text-adworks-blue bg-blue-50'
                      }`}>
                        {task.priority === 'high' ? 'Urgente' : 'Normal'}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium">{task.description}</p>
                    {task.dueDate && (
                      <div className="flex items-center mt-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        PRAZO: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(task.actionUrl)}
                  className="bg-adworks-blue text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-adworks-blue/20 flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>{task.action}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
