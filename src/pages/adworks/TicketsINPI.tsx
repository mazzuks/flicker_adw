import { useState, useEffect } from 'react';
import { Award, Search, Filter, CheckCircle2, Clock, AlertCircle, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Ticket = {
  id: string;
  company_id: string;
  type: string;
  status: string;
  priority: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
};

export default function TicketsINPI() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, client:clients(name)')
        .eq('type', 'TICKET_INPI')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ticketsWithCompany = (data || []).map((ticket: any) => ({
        ...ticket,
        company_name: ticket.client?.name || 'N/A',
      }));

      setTickets(ticketsWithCompany);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChecklistItems = async (ticketId: string) => {
    const { data } = await supabase
      .from('ticket_checklist_items')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('order_index', { ascending: true });

    setChecklistItems(data || []);
  };

  const toggleChecklistItem = async (itemId: string, completed: boolean) => {
    await supabase
      .from('ticket_checklist_items')
      .update({ completed: !completed })
      .eq('id', itemId);

    loadChecklistItems(selectedTicket!.id);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    await supabase
      .from('tickets')
      .update({ status: newStatus as any, updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    loadTickets();
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(term) ||
          ticket.company_name?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-amber-100 text-amber-800',
      WAITING_CLIENT: 'bg-purple-100 text-purple-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-slate-100 text-slate-800',
    };

    const labels: Record<string, string> = {
      OPEN: 'Aberto',
      IN_PROGRESS: 'Em Progresso',
      WAITING_CLIENT: 'Aguardando Cliente',
      RESOLVED: 'Resolvido',
      CLOSED: 'Fechado',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      LOW: 'bg-slate-100 text-slate-700',
      MEDIUM: 'bg-blue-100 text-blue-700',
      HIGH: 'bg-orange-100 text-orange-700',
      URGENT: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
      LOW: 'Baixa',
      MEDIUM: 'Média',
      HIGH: 'Alta',
      URGENT: 'Urgente',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tickets INPI</h1>
        <p className="text-slate-600 mt-1">Gerencie todos os tickets de registro de marcas e patentes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tickets..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value="OPEN">Aberto</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="WAITING_CLIENT">Aguardando Cliente</option>
              <option value="RESOLVED">Resolvido</option>
              <option value="CLOSED">Fechado</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas Prioridades</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
            onClick={() => {
              setSelectedTicket(ticket);
              loadChecklistItems(ticket.id);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {ticket.company_name}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <p className="text-slate-600 mb-3 line-clamp-2">{ticket.description}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum ticket encontrado</p>
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{selectedTicket.title}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900 font-medium">{selectedTicket.company_name}</span>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="OPEN">Aberto</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="WAITING_CLIENT">Aguardando Cliente</option>
                  <option value="RESOLVED">Resolvido</option>
                  <option value="CLOSED">Fechado</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Descrição</h3>
                <p className="text-slate-600">{selectedTicket.description}</p>
              </div>

              {checklistItems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Checklist</h3>
                  <div className="space-y-2">
                    {checklistItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(item.id, item.completed)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-900'}>
                          {item.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
