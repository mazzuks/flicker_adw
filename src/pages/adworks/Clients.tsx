import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileText,
  LogIn,
  MoreVertical,
  Download,
  Trash2,
  CheckSquare,
  MessageSquare,
  Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

type Company = {
  id: string;
  name: string;
  fantasy_name: string | null;
  cnpj: string | null;
  status: string;
  plan: string;
  created_at: string;
  member_count?: number;
  email?: string;
  phone?: string;
};

export function Clients() {
  const { setCurrentClientId } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, statusFilter, companies]);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const companiesWithCounts = await Promise.all(
        (data || []).map(async (company) => {
          const { count } = await supabase
            .from('client_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', company.id);

          return {
            ...company,
            member_count: count || 0,
            email: 'contato@cliente.com', // Placeholder
            phone: '(11) 99999-9999'   // Placeholder
          };
        })
      );

      setCompanies(companiesWithCounts);
    } catch (err) {
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(term) || c.fantasy_name?.toLowerCase().includes(term));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    setFilteredCompanies(filtered);
  };

  const handleImpersonate = (clientId: string) => {
    setCurrentClientId(clientId);
    navigate('/client');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCompanies.length) setSelectedIds([]);
    else setSelectedIds(filteredCompanies.map(c => c.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
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
            Carteira de Clientes
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Exibindo {filteredCompanies.length} resultados</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-100 text-adworks-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
             <Download className="w-4 h-4 text-gray-400" />
             Importar Lote
           </button>
           <button className="bg-adworks-blue text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
             <Plus className="w-4 h-4" />
             Adicionar
           </button>
        </div>
      </div>

      {/* SEARCH & BATCH ACTIONS (ERP Style) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-adw-soft border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou login..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-adworks-gray border-none rounded-[1.2rem] text-xs font-bold text-adworks-dark outline-none focus:ring-1 focus:ring-adworks-blue"
            />
          </div>
          <button className="bg-adworks-dark text-white px-8 py-3 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
            Buscar
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="p-4 bg-red-50 rounded-2xl flex items-center justify-between border border-red-100 animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{selectedIds.length} Clientes Selecionados</p>
            <div className="flex gap-2">
               <button className="bg-white text-red-600 px-4 py-1.5 rounded-lg font-black text-[9px] uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all">Apagar Selecionados</button>
            </div>
          </div>
        )}
      </div>

      {/* DENSE TABLE (Custom Client List Style) */}
      <div className="bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-adworks-gray/50 border-b border-gray-100">
                <th className="px-8 py-6 w-10">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 rounded border-gray-300 text-adworks-blue focus:ring-adworks-blue"
                     checked={selectedIds.length === filteredCompanies.length && filteredCompanies.length > 0}
                     onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-4 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome / Fantasia</th>
                <th className="px-4 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Acesso / Login</th>
                <th className="px-4 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Telefone</th>
                <th className="px-4 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right px-8">Opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="group hover:bg-adworks-gray/30 transition-all">
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-adworks-blue focus:ring-adworks-blue"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-adworks-dark text-sm uppercase italic leading-tight">{c.fantasy_name || c.name}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{c.name}</p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-adworks-blue group-hover:underline cursor-pointer">
                       <Mail className="w-3.5 h-3.5" />
                       {c.email}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-xs font-black text-adworks-dark">{c.phone}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button title="Ver Dossiê" className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue hover:shadow-md transition-all">
                          <Eye className="w-4 h-4" />
                       </button>
                       <button title="Financeiro" className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-md transition-all">
                          <CreditCard className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => handleImpersonate(c.id)}
                        title="Logar como Cliente" 
                        className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-orange-600 hover:shadow-md transition-all"
                       >
                          <LogIn className="w-4 h-4" />
                       </button>
                       <button title="Mensagem" className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue hover:shadow-md transition-all">
                          <MessageSquare className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic opacity-50">Nenhum cliente cadastrado</div>
          )}
        </div>
      </div>
    </div>
  );
}
