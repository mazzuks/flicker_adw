import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export function AdworksDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    waitingClientTickets: 0,
    overdueTickets: 0,
    completedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, status')
      .eq('status', 'ACTIVE');

    const { data: allTickets } = await supabase.from('tickets').select('*');

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStats({
      totalClients: clients?.length || 0,
      activeClients: clients?.length || 0,
      totalTickets: allTickets?.length || 0,
      newTickets: allTickets?.filter((t) => t.status === 'NEW').length || 0,
      inProgressTickets: allTickets?.filter((t) => t.status === 'IN_PROGRESS').length || 0,
      waitingClientTickets:
        allTickets?.filter((t) => t.status === 'WAITING_CLIENT').length || 0,
      overdueTickets:
        allTickets?.filter(
          (t) => t.sla_due_at && new Date(t.sla_due_at) < now && t.status !== 'DONE'
        ).length || 0,
      completedThisMonth:
        allTickets?.filter(
          (t) =>
            t.status === 'DONE' &&
            new Date(t.updated_at) >= firstDayOfMonth
        ).length || 0,
    });

    setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Adworks</h1>
        <p className="text-gray-600 mt-1">Visão geral das operações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeClients}</p>
          <p className="text-sm text-gray-600">Clientes Ativos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalTickets}</p>
          <p className="text-sm text-gray-600">Total de Tickets</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.inProgressTickets}</p>
          <p className="text-sm text-gray-600">Em Andamento</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.completedThisMonth}</p>
          <p className="text-sm text-gray-600">Concluídos este mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status dos Tickets</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Novos</p>
                <p className="text-xs text-gray-600">Aguardando atribuição</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.newTickets}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Aguardando Cliente</p>
                <p className="text-xs text-gray-600">Pendente de resposta</p>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.waitingClientTickets}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Atrasados</p>
                <p className="text-xs text-gray-600">SLA vencido</p>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.overdueTickets}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/adworks/tickets/cnpj')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Tickets CNPJ</p>
                  <p className="text-sm text-gray-600">Gerenciar abertura de empresas</p>
                </div>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            <button
              onClick={() => navigate('/adworks/tickets/inpi')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Tickets INPI</p>
                  <p className="text-sm text-gray-600">Gerenciar registro de marcas</p>
                </div>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            <button
              onClick={() => navigate('/adworks/clients')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Clientes</p>
                  <p className="text-sm text-gray-600">Visualizar todos os clientes</p>
                </div>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {stats.overdueTickets > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Atenção: {stats.overdueTickets} ticket(s) atrasado(s)
              </h3>
              <p className="text-sm text-red-800">
                Alguns tickets ultrapassaram o prazo do SLA e precisam de atenção imediata.
              </p>
              <button
                onClick={() => navigate('/adworks/tickets/cnpj')}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Ver tickets atrasados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
