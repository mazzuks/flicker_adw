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
  MoreHorizontal
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
};

export function Clients() {
  const { setCurrentClientId } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, companies]);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const companiesWithCounts = await Promise.all(
        (data || []).map(async (company) => {
          const { count } = await supabase.from('client_memberships').select('*', { count: 'exact', head: true }).eq('client_id', company.id);
          return { ...company, member_count: count || 0, email: 'contato@cliente.com' };
        })
      );
      setCompanies(companiesWithCounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.fantasy_name?.toLowerCase().includes(term => term.includes(searchTerm.toLowerCase()))
    );
    setFilteredCompanies(filtered);
  };

  const handleImpersonate = (clientId: string) => {
    setCurrentClientId(clientId);
    navigate('/client');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-adworks-border">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight">Carteira de Clientes</h1>
          <p className="text-adworks-muted text-sm mt-1">Gestão de empresas e acessos operacionais.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-adworks-surface border border-adworks-border text-adworks-dark px-4 py-2 rounded-lg text-xs font-bold hover:bg-adworks-accent transition-all shadow-adw-flat flex items-center gap-2">
             <Download className="w-4 h-4 text-adworks-muted" />
             Importar Lote
           </button>
           <button className="bg-adworks-blue text-white px-5 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all shadow-md flex items-center gap-2">
             <Plus className="w-4 h-4" />
             Adicionar Cliente
           </button>
        </div>
      </div>

      {/* SEARCH & FILTERS (Enterprise Bar) */}
      <div className="bg-adworks-surface p-4 rounded-adw shadow-adw-card border border-adworks-border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
          <input
            type="text"
            placeholder="Pesquisar por nome, fantasia ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-adworks-accent border-none rounded-lg text-sm font-medium text-adworks-dark outline-none focus:ring-1 focus:ring-adworks-blue transition-all"
          />
        </div>
        <div className="flex gap-2">
           <button className="p-2.5 bg-adworks-surface border border-adworks-border text-adworks-muted rounded-lg hover:text-adworks-blue transition-all">
             <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* DENSE ENTERPRISE TABLE */}
      <div className="bg-adworks-surface rounded-adw-lg shadow-adw-card border border-adworks-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-adworks-gray border-b border-adworks-border">
              <tr>
                <th className="px-6 py-4 w-10">
                   <input type="checkbox" className="w-4 h-4 rounded border-adworks-border text-adworks-blue focus:ring-adworks-blue" />
                </th>
                <th className="px-4 py-4 text-[10px] font-black text-adworks-muted uppercase tracking-widest">Empresa / Razão Social</th>
                <th className="px-4 py-4 text-[10px] font-black text-adworks-muted uppercase tracking-widest">Status</th>
                <th className="px-4 py-4 text-[10px] font-black text-adworks-muted uppercase tracking-widest">Plano</th>
                <th className="px-4 py-4 text-[10px] font-black text-adworks-muted uppercase tracking-widest">Membros</th>
                <th className="px-6 py-4 text-[10px] font-black text-adworks-muted uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adworks-border">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="group hover:bg-adworks-accent/50 transition-all">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-adworks-border text-adworks-blue focus:ring-adworks-blue" />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-adworks-dark text-sm leading-tight">{c.fantasy_name || c.name}</p>
                    <p className="text-[10px] font-medium text-adworks-muted uppercase mt-0.5 tracking-tighter">{c.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${c.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                       {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-adworks-dark uppercase tracking-tight">
                       <CreditCard className="w-3.5 h-3.5 text-adworks-blue" />
                       {c.plan || 'BASIC'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-adworks-dark">
                       <User className="w-3.5 h-3.5 text-adworks-blue" />
                       {c.member_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => handleImpersonate(c.id)} title="Impersonate" className="p-2 rounded-lg bg-adworks-surface border border-adworks-border text-adworks-muted hover:text-orange-600 hover:border-orange-100 transition-all"><LogIn className="w-4 h-4" /></button>
                       <button className="p-2 rounded-lg bg-adworks-surface border border-adworks-border text-adworks-muted hover:text-adworks-blue hover:border-blue-100 transition-all"><Eye className="w-4 h-4" /></button>
                       <button className="p-2 rounded-lg bg-adworks-surface border border-adworks-border text-adworks-muted hover:text-adworks-dark hover:border-adworks-border transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
