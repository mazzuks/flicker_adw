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
  MoreVertical
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
};

export function Clients() {
  const { setCurrentClientId } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, statusFilter, companies]);

  const handleImpersonate = (clientId: string) => {
    setCurrentClientId(clientId);
    navigate('/');
  };

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
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          company.fantasy_name?.toLowerCase().includes(term) ||
          (company.cnpj && company.cnpj.includes(term))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((company) => company.status === statusFilter);
    }

    setFilteredCompanies(filtered);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-50 text-green-600 border-green-100',
      ONBOARDING: 'bg-orange-50 text-orange-600 border-orange-100',
      SUSPENDED: 'bg-red-50 text-red-600 border-red-100',
    };
    const labels: Record<string, string> = {
      ACTIVE: 'Ativo',
      ONBOARDING: 'Onboarding',
      SUSPENDED: 'Suspenso',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${colors[status] || 'bg-gray-50 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    );
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
          <p className="text-gray-500 font-medium">Gerenciamento de empresas e acessos.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-adw-soft border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, fantasia ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue text-adworks-dark font-bold"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-100 text-adworks-dark px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-adworks-blue transition-all"
          >
            <option value="all">Todos os Status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="ONBOARDING">Em Onboarding</option>
            <option value="SUSPENDED">Suspensos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum cliente encontrado</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-[2rem] p-8 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/30 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-adworks-gray rounded-[1.5rem] flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                    <Building2 className="w-10 h-10 text-adworks-blue/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-adworks-dark tracking-tight leading-tight uppercase italic">{company.fantasy_name || company.name}</h3>
                      {getStatusBadge(company.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{company.name}</p>
                      <span className="w-1 h-1 bg-gray-200 rounded-full hidden sm:block"></span>
                      <p className="text-xs font-black text-adworks-blue uppercase tracking-tighter">
                        {company.cnpj || 'CNPJ Pendente'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Usuários</p>
                     <div className="flex items-center gap-1.5 font-bold text-adworks-dark">
                        <User className="w-3.5 h-3.5 text-adworks-blue" />
                        {company.member_count}
                     </div>
                   </div>
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Plano</p>
                     <div className="flex items-center gap-1.5 font-bold text-adworks-dark uppercase text-xs">
                        <CreditCard className="w-3.5 h-3.5 text-adworks-blue" />
                        {company.plan || 'Nenhum'}
                     </div>
                   </div>
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Desde</p>
                     <div className="flex items-center gap-1.5 font-bold text-adworks-dark text-xs">
                        <Calendar className="w-3.5 h-3.5 text-adworks-blue" />
                        {new Date(company.created_at).toLocaleDateString('pt-BR')}
                     </div>
                   </div>
                   <div className="flex items-center justify-end gap-2 relative">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === company.id ? null : company.id)}
                          className="w-10 h-10 rounded-xl bg-adworks-gray text-gray-400 hover:text-adworks-dark transition-all flex items-center justify-center"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openMenuId === company.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                            <button 
                              onClick={() => handleImpersonate(company.id)}
                              className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-adworks-blue hover:bg-blue-50 flex items-center gap-3 transition-colors"
                            >
                              <LogIn className="w-4 h-4" />
                              Logar como Cliente
                            </button>
                            <button 
                              className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Dossiê
                            </button>
                          </div>
                        )}
                      </div>

                      <button className="w-12 h-12 rounded-2xl bg-adworks-gray text-gray-400 hover:bg-adworks-blue hover:text-white transition-all flex items-center justify-center group-hover:shadow-lg">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
