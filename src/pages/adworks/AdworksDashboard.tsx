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
  ArrowUpRight,
  Zap,
  Building2,
  Briefcase,
  Activity
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
      .select('id, status');

    const { data: allTickets } = await supabase.from('tickets').select('*');

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStats({
      totalClients: clients?.length || 0,
      activeClients: clients?.filter(c => c.status === 'ACTIVE').length || 0,
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
            (t.status === 'DONE' || t.status === 'APPROVED') &&
            new Date(t.updated_at) >= firstDayOfMonth
        ).length || 0,
    });

    setLoading(false);
  };

  const isOperator = window.location.pathname.startsWith('/operator');
  const basePath = isOperator ? '/operator' : '/master';

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
            Command Center
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Gestão operacional da Adworks em tempo real.</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-4 border border-white/10 ${isOperator ? 'bg-adworks-dark' : 'bg-orange-600'}`}>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </div>
          <span className="text-xs font-black text-white uppercase tracking-widest">{isOperator ? 'Operator Domain' : 'Master Domain'}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate(`${basePath}/clients`)}
          className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100 hover:scale-[1.02] transition-all cursor-pointer group active:scale-95"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-adworks-blue group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Clientes Ativos</p>
          <h3 className="text-4xl font-black text-adworks-dark tracking-tighter">{stats.activeClients}</h3>
        </div>

        <div 
          onClick={() => navigate(`${basePath}/tasks`)}
          className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100 hover:scale-[1.02] transition-all cursor-pointer group active:scale-95"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileText className="w-7 h-7" />
            </div>
            <div className="bg-purple-100 px-2 py-1 rounded text-[10px] font-black text-purple-700 uppercase italic">Central</div>
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total de Tickets</p>
          <h3 className="text-4xl font-black text-adworks-dark tracking-tighter">{stats.totalTickets}</h3>
        </div>

        <div 
          onClick={() => navigate(`${basePath}/tasks`, { state: { filter: 'urgent' } })}
          className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100 hover:scale-[1.02] transition-all cursor-pointer group active:scale-95"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-7 h-7" />
            </div>
            {stats.overdueTickets > 0 && (
              <span className="animate-pulse bg-red-500 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            )}
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-orange-600">Atrasados (SLA)</p>
          <h3 className="text-4xl font-black text-adworks-dark tracking-tighter">{stats.overdueTickets}</h3>
        </div>

        <div 
          onClick={() => navigate(`${basePath}/tasks`)}
          className={`p-8 rounded-[2.5rem] shadow-2xl text-white hover:scale-[1.02] transition-all cursor-pointer active:scale-95 ${isOperator ? 'bg-adworks-dark' : 'bg-orange-600'} shadow-blue-500/20`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <Activity className="w-5 h-5 text-white/50" />
          </div>
          <p className="text-sm font-black text-white/60 uppercase tracking-widest">Concluídos (Mês)</p>
          <h3 className="text-4xl font-black tracking-tighter">{stats.completedThisMonth}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-adworks-dark uppercase italic flex items-center">
                <Zap className="w-6 h-6 mr-2 text-adworks-blue" />
                Ações Rápidas
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => navigate(`${basePath}/tickets/cnpj`)}
                className="group p-8 bg-adworks-gray/50 rounded-3xl border border-transparent hover:border-adworks-blue/30 hover:bg-white transition-all text-left active:scale-95"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-adworks-blue" />
                </div>
                <h4 className="font-black text-adworks-dark text-lg mb-1 italic uppercase tracking-tight">Fila de CNPJ</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stats.newTickets} PROCESSOS AGUARDANDO</p>
              </button>

              <button 
                onClick={() => navigate(`${basePath}/tickets/inpi`)}
                className="group p-8 bg-adworks-gray/50 rounded-3xl border border-transparent hover:border-purple-300 hover:bg-white transition-all text-left active:scale-95"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-black text-adworks-dark text-lg mb-1 italic uppercase tracking-tight">Registro de Marcas</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PROTOCOLO INPI EM TEMPO REAL</p>
              </button>
           </div>
        </div>

        <div className={`${isOperator ? 'bg-adworks-dark' : 'bg-adworks-blue'} rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-all duration-700"></div>
          <h3 className="text-xl font-black mb-8 uppercase italic tracking-tighter">Status da Fila</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Em Andamento</span>
              <span className="text-lg font-black">{stats.inProgressTickets}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
               <div className="bg-white h-full shadow-[0_0_10px_white]" style={{ width: `${(stats.inProgressTickets / (stats.totalTickets || 1)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Aguardando Cliente</span>
              <span className="text-lg font-black text-orange-400">{stats.waitingClientTickets}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
               <div className="bg-orange-400 h-full" style={{ width: `${(stats.waitingClientTickets / (stats.totalTickets || 1)) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Daily Performance Radar</p>
             <div className="flex items-end gap-1.5 h-12">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-t-lg group-hover:bg-white/40 transition-all shadow-inner" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
