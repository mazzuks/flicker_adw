import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Calendar,
  Download,
  DollarSign,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BatchFiscalUpload } from '../../components/BatchFiscalUpload';

type Ticket = {
  id: string;
  client_id: string;
  type: string;
  status: string;
  priority: string;
  sla_due_at: string | null;
  created_at: string;
  updated_at: string;
  client_name?: string;
  amount?: number;
};

export function TicketsFiscal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBatchModal, setShowBatchModal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, statusFilter, tickets]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, client:clients(name)')
        .eq('type', 'TICKET_FISCAL')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ticketsWithCompany = (data || []).map((ticket: any) => ({
        ...ticket,
        client_name: ticket.client?.name || 'N/A',
        // Mock de valores para visualização financeira no fiscal
        amount: Math.floor(Math.random() * 500) + 50,
      }));

      setTickets(ticketsWithCompany);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((t) => t.client_name?.toLowerCase().includes(term));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    setFilteredTickets(filtered);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      NEW: { label: 'Pendente', color: 'text-orange-600 bg-orange-50 border-orange-100' },
      DONE: { label: 'Enviado', color: 'text-green-600 bg-green-50 border-green-100' },
      WAITING_CLIENT: {
        label: 'Aguard. Cliente',
        color: 'text-blue-600 bg-blue-50 border-blue-100',
      },
    };
    const config = configs[status] || {
      label: status,
      color: 'text-gray-400 bg-gray-50 border-gray-100',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showBatchModal && (
        <BatchFiscalUpload
          onClose={() => setShowBatchModal(false)}
          onComplete={() => {
            loadTickets();
          }}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Gestão Fiscal
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">
            Publicação de guias e controle de faturamento dos clientes.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBatchModal(true)}
            className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Subir Lote DAS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Guias Pendentes
          </p>
          <h3 className="text-4xl font-black tracking-tighter italic text-orange-500">
            {tickets.filter((t) => t.status === 'NEW').length}
          </h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Faturamento do Mês
          </p>
          <h3 className="text-4xl font-black tracking-tighter italic text-adworks-dark">
            R$ 12.450
          </h3>
        </div>
        <div className="bg-adworks-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">
            SLA Médio Fiscal
          </p>
          <h3 className="text-4xl font-black tracking-tighter italic">1.2 dias</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-adw-soft border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar por nome da empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue text-adworks-dark font-bold"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-4 bg-adworks-gray text-gray-400 rounded-2xl hover:text-adworks-blue transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-adworks-gray/50 border-b border-gray-100">
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Empresa
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Mês Ref.
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Valor Guia
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="group hover:bg-adworks-gray/30 transition-all">
                <td className="px-8 py-6">
                  <p className="font-black text-adworks-dark uppercase italic tracking-tight">
                    {ticket.client_name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Abertura: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-adworks-dark">
                    <Calendar className="w-4 h-4 text-adworks-blue" />
                    FEVEREIRO / 2026
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-adworks-dark tracking-tighter">
                    R$ {ticket.amount?.toFixed(2)}
                  </p>
                </td>
                <td className="px-8 py-6">{getStatusBadge(ticket.status)}</td>
                <td className="px-8 py-6 text-right">
                  <button className="w-10 h-10 bg-adworks-gray text-gray-400 rounded-xl flex items-center justify-center hover:bg-adworks-blue hover:text-white transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTickets.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
            Nenhuma guia encontrada para os filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}
