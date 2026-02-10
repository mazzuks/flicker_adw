import { useState, useEffect } from 'react';
import { Building2, Search, Filter, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Company = {
  id: string;
  legal_name: string;
  cnpj: string | null;
  email: string;
  phone: string;
  created_at: string;
  onboarding_completed: boolean;
  member_count?: number;
};

export default function Clients() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, statusFilter, companies]);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const companiesWithCounts = await Promise.all(
        (data || []).map(async (company) => {
          const { count } = await supabase
            .from('company_members')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

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
          company.legal_name.toLowerCase().includes(term) ||
          company.email.toLowerCase().includes(term) ||
          (company.cnpj && company.cnpj.includes(term))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((company) =>
        statusFilter === 'active'
          ? company.onboarding_completed
          : !company.onboarding_completed
      );
    }

    setFilteredCompanies(filtered);
  };

  const getStatusBadge = (completed: boolean) => {
    if (completed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Onboarding
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
        <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
        <p className="text-slate-600 mt-1">Gerencie todas as empresas cadastradas</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, email ou CNPJ..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="pending">Em Onboarding</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Empresa
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  CNPJ
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Contato
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Membros
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Criado em
                </th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{company.legal_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {company.cnpj || '-'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {company.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {company.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {company.member_count}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(company.onboarding_completed)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(company.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedCompany(company)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Nenhuma empresa encontrada</p>
            </div>
          )}
        </div>
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Detalhes da Empresa</h2>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Razão Social</label>
                    <p className="text-slate-900 mt-1">{selectedCompany.legal_name}</p>
                  </div>
                  {selectedCompany.cnpj && (
                    <div>
                      <label className="text-sm font-medium text-slate-700">CNPJ</label>
                      <p className="text-slate-900 mt-1">{selectedCompany.cnpj}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <p className="text-slate-900 mt-1">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Telefone</label>
                    <p className="text-slate-900 mt-1">{selectedCompany.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCompany.onboarding_completed)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Membros</label>
                    <p className="text-slate-900 mt-1">{selectedCompany.member_count}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Data de Cadastro</h3>
                <p className="text-slate-600">
                  {new Date(selectedCompany.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
