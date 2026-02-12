import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { 
  Award, 
  Clock, 
  User, 
  CheckSquare, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  id: string;
  client_id: string;
  status: string;
  priority: string;
  sla_due_at: string | null;
  data_json: any;
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

export function TicketsINPI() {
  const { isAdworks } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      .eq('type', 'TICKET_INPI')
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
      READY: 'Pronto para Protocolo',
      IN_PROGRESS: 'Em Análise INPI',
      SUBMITTED: 'Protocolado',
      PENDING_EXTERNAL: 'Oposição',
      APPROVED: 'Marca Deferida',
      DONE: 'Concluído',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800 border-blue-200',
      WAITING_CLIENT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      READY: 'bg-purple-100 text-purple-800 border-purple-200',
      IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      SUBMITTED: 'bg-orange-100 text-orange-800 border-orange-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      DONE: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const statusCounts = {
    all: tickets.length,
    NEW: tickets.filter((t) => t.status === 'NEW').length,
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'SUBMITTED').length,
    WAITING_CLIENT: tickets.filter((t) => t.status === 'WAITING_CLIENT').length,
    APPROVED: tickets.filter((t) => t.status === 'APPROVED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Modal Dossier INPI */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-purple-50/30">
              <div>
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Dossiê de Marca</span>
                <h2 className="text-2xl font-black text-adworks-dark mt-2 italic uppercase tracking-tighter">{selectedTicket.data_json?.brand_name || selectedTicket.client?.fantasy_name}</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-dark transition-all shadow-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-adworks-gray/50 rounded-3xl p-6 border border-gray-100">
                  <h3 className="text-sm font-black text-adworks-dark uppercase mb-4 flex items-center tracking-widest">
                    <Award className="w-4 h-4 mr-2 text-purple-600" />
                    Briefing da Marca
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm"><span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Nome da Marca:</span> <br/><span className="font-black text-adworks-dark">{selectedTicket.data_json?.brand_name || 'N/A'}</span></p>
                    <p className="text-sm"><span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Classe Sugerida:</span> <br/><span className="font-black text-adworks-dark uppercase italic">Classe {selectedTicket.data_json?.brand_class || 'N/A'}</span></p>
                  </div>
                </div>

                <div className="bg-adworks-gray/50 rounded-3xl p-6 border border-gray-100">
                  <h3 className="text-sm font-black text-adworks-dark uppercase mb-4 flex items-center tracking-widest">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    Timeline INPI
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status:</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${getStatusColor(selectedTicket.status)}`}>{getStatusLabel(selectedTicket.status)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Protocolo Adworks:</span>
                      <span className="text-sm font-black text-adworks-dark"># {selectedTicket.id.slice(0,8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-adworks-dark rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-sm font-black text-gray-400 uppercase mb-6 tracking-[0.2em] relative z-10">Dossiê Técnico (JSON)</h3>
                <pre className="text-purple-300 text-[11px] overflow-x-auto font-mono leading-relaxed relative z-10">
                  {JSON.stringify(selectedTicket.data_json || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-adworks-gray/30 flex justify-end">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-adworks-dark text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg active:scale-95"
              >
                Fechar Dossiê
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Registro de Marcas
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Gestão de protocolos INPI e proteção de propriedade intelectual.</p>
        </div>
        <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Novo Protocolo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'all', label: 'Todos', count: statusCounts.all, color: 'adworks-dark' },
          { key: 'NEW', label: 'Briefing', count: statusCounts.NEW, color: 'blue-600' },
          { key: 'IN_PROGRESS', label: 'Protocolados', count: statusCounts.IN_PROGRESS, color: 'purple-600' },
          { key: 'WAITING_CLIENT', label: 'Pendências', count: statusCounts.WAITING_CLIENT, color: 'orange-500' },
          { key: 'APPROVED', label: 'Deferidos', count: statusCounts.APPROVED, color: 'green-600' }
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setSelectedStatus(s.key)}
            className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${
              selectedStatus === s.key
                ? `border-${s.color} bg-white shadow-xl scale-105`
                : 'border-transparent bg-white shadow-adw-soft hover:border-gray-200'
            }`}
          >
            <p className={`text-3xl font-black tracking-tighter mb-1 ${selectedStatus === s.key ? `text-${s.color}` : 'text-adworks-dark'}`}>{s.count}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-20 text-center opacity-30 italic font-black text-adworks-dark uppercase tracking-widest">
            <Award className="w-16 h-16 mx-auto mb-4" />
            Nenhuma marca em processo
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-adworks-gray/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Marca / Cliente</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Etapa INPI</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Prioridade</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-adworks-gray/30 transition-all">
                    <td className="px-8 py-6">
                      <p className="font-black text-adworks-dark uppercase italic tracking-tight leading-tight">
                        {ticket.data_json?.brand_name || 'MARCA SEM NOME'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                        {ticket.client?.fantasy_name || ticket.client?.name}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border-none shadow-sm outline-none cursor-pointer ${getStatusColor(ticket.status)}`}
                      >
                        <option value="NEW">Novo Briefing</option>
                        <option value="READY">Pronto para Protocolo</option>
                        <option value="SUBMITTED">Protocolado</option>
                        <option value="IN_PROGRESS">Análise INPI</option>
                        <option value="APPROVED">Deferido</option>
                        <option value="DONE">Concluído</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)} bg-opacity-20 border-none`}>
                        CLASSE {ticket.data_json?.brand_class || '??'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsModalOpen(true);
                        }}
                        className="w-10 h-10 bg-adworks-gray text-gray-400 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
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
