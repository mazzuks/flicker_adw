import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { FileText, Clock, User, CheckSquare, MessageSquare, Plus } from 'lucide-react';

interface Ticket {
  id: string;
  client_id: string;
  status: string;
  priority: string;
  sla_due_at: string | null;
  created_at: string;
  updated_at: string;
  client: {
    name: string;
    fantasy_name: string;
  };
  assigned_to_user: {
    email: string;
    full_name: string;
  } | null;
}

export function TicketsCNPJ() {
  const { isAdworks } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdworks) {
      loadTickets();
    }
  }, [isAdworks, selectedStatus]);

  const loadTickets = async () => {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        client:client_id (
          name,
          fantasy_name
        ),
        assigned_to_user:assigned_to (
          email,
          full_name
        )
      `)
      .eq('type', 'TICKET_CNPJ')
      .order('created_at', { ascending: false });

    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }

    const { data } = await query;

    if (data) {
      setTickets(data as any);
    }

    setLoading(false);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    if (!error) {
      loadTickets();
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      NEW: 'Novo',
      WAITING_CLIENT: 'Aguardando Cliente',
      READY: 'Pronto',
      IN_PROGRESS: 'Em Andamento',
      SUBMITTED: 'Enviado',
      PENDING_EXTERNAL: 'Aguardando Órgão',
      APPROVED: 'Aprovado',
      DONE: 'Concluído',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800 border-blue-200',
      WAITING_CLIENT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      READY: 'bg-green-100 text-green-800 border-green-200',
      IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
      SUBMITTED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      PENDING_EXTERNAL: 'bg-orange-100 text-orange-800 border-orange-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      DONE: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'text-gray-600',
      NORMAL: 'text-blue-600',
      HIGH: 'text-orange-600',
      URGENT: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const statusCounts = {
    all: tickets.length,
    NEW: tickets.filter((t) => t.status === 'NEW').length,
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    WAITING_CLIENT: tickets.filter((t) => t.status === 'WAITING_CLIENT').length,
    DONE: tickets.filter((t) => t.status === 'DONE').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets CNPJ</h1>
          <p className="text-gray-600 mt-1">Gerencie processos de abertura de CNPJ</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Novo Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedStatus === 'all'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          <p className="text-sm text-gray-600 mt-1">Todos</p>
        </button>
        <button
          onClick={() => setSelectedStatus('NEW')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedStatus === 'NEW'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-blue-900">{statusCounts.NEW}</p>
          <p className="text-sm text-gray-600 mt-1">Novos</p>
        </button>
        <button
          onClick={() => setSelectedStatus('IN_PROGRESS')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedStatus === 'IN_PROGRESS'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-purple-900">{statusCounts.IN_PROGRESS}</p>
          <p className="text-sm text-gray-600 mt-1">Em Andamento</p>
        </button>
        <button
          onClick={() => setSelectedStatus('WAITING_CLIENT')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedStatus === 'WAITING_CLIENT'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-yellow-900">{statusCounts.WAITING_CLIENT}</p>
          <p className="text-sm text-gray-600 mt-1">Aguardando</p>
        </button>
        <button
          onClick={() => setSelectedStatus('DONE')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedStatus === 'DONE'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-green-900">{statusCounts.DONE}</p>
          <p className="text-sm text-gray-600 mt-1">Concluídos</p>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum ticket encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.client?.fantasy_name || ticket.client?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.assigned_to_user ? (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {ticket.assigned_to_user.full_name || ticket.assigned_to_user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Não atribuído</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.sla_due_at ? (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(ticket.sla_due_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sem prazo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <select 
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        className="text-xs border rounded-md px-2 py-1 bg-white shadow-sm focus:ring-1 focus:ring-adworks-blue outline-none"
                      >
                        <option value="NEW">Novo</option>
                        <option value="IN_PROGRESS">Em Andamento</option>
                        <option value="WAITING_CLIENT">Pedir Documento</option>
                        <option value="DONE">Concluir</option>
                      </select>
                      <button className="text-adworks-blue hover:text-blue-900 ml-2">
                        <MessageSquare className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
