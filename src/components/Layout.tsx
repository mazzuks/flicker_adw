import { ReactNode } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { NotificationCenter } from './NotificationCenter';
import {
  Building2,
  Home,
  CheckSquare,
  Inbox,
  Users,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Zap,
  BarChart3,
  ShieldCheck,
  Package
} from 'lucide-react';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, signOut, isAdworks, currentClientId, setCurrentClientId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const stopImpersonating = () => {
    setCurrentClientId(null);
    navigate('/admin');
  };

  const isViewingAdmin = location.pathname.startsWith('/admin');

  // 👤 CAIXINHA DO CLIENTE (/app)
  const clientNavItems = [
    { icon: Home, label: 'Dashboard', path: '/app' },
    { icon: Package, label: 'Onboarding', path: '/app/onboarding' },
    { icon: CheckSquare, label: 'Tarefas', path: '/app/tasks' },
    { icon: Inbox, label: 'Mensagens', path: '/app/messages' },
    { icon: Users, label: 'CRM', path: '/app/crm' },
    { icon: FileText, label: 'Financeiro', path: '/app/finance' },
  ];

  // 🎧 CAIXINHA DO OPERADOR (/admin)
  const adworksNavItems = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/admin' },
    { icon: Building2, label: 'Clientes', path: '/admin/clients' },
    { icon: CheckSquare, label: 'Fila de Trabalho', path: '/admin/tasks' },
    { icon: FileText, label: 'Tickets CNPJ', path: '/admin/tickets/cnpj' },
    { icon: Briefcase, label: 'Tickets INPI', path: '/admin/tickets/inpi' },
    { icon: Inbox, label: 'Chat Global', path: '/admin/messages' },
  ];

  // 🛡️ CAIXINHA DO MASTER (Extra links no /admin)
  const masterNavItems = [
    ...adworksNavItems,
    { icon: Users, label: 'Equipe', path: '/admin/team' },
    { icon: BarChart3, label: 'Métricas', path: '/admin/analytics' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const isMaster = profile?.role_global === 'ADWORKS_SUPERADMIN';
  const navItems = isViewingAdmin 
    ? (isMaster ? masterNavItems : adworksNavItems) 
    : clientNavItems;

  const isImpersonating = isAdworks && currentClientId && !isViewingAdmin;

  return (
    <div className="min-h-screen bg-adworks-gray">
      {/* INDICADOR DE CONTEXTO GLOBAL */}
      {isViewingAdmin ? (
        <div className="bg-adworks-dark text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 border-b border-white/5">
          <ShieldCheck className="w-3 h-3 text-adworks-blue" />
          Ambiente de Operação Interna
        </div>
      ) : (
        <div className="bg-adworks-blue text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
          <Building2 className="w-3 h-3" />
          Painel do Empreendedor
        </div>
      )}

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 shadow-2xl z-[100] relative animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            VISÃO DO CLIENTE ATIVA
          </div>
          <button 
            onClick={stopImpersonating}
            className="bg-white text-orange-600 px-4 py-1.5 rounded-full font-black hover:bg-orange-50 transition-all shadow-sm active:scale-95"
          >
            VOLTAR AO ADMIN
          </button>
        </div>
      )}

      <nav className="bg-white border-b border-gray-100 shadow-adw-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${isViewingAdmin ? 'bg-adworks-dark' : 'bg-adworks-blue'} shadow-blue-500/20`}>
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-adworks-dark italic uppercase">ADWORKS</span>
              </Link>

              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-adworks-blue text-white shadow-xl shadow-adworks-blue/20 scale-105' 
                          : 'text-gray-400 hover:text-adworks-dark hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <NotificationCenter />

              <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-adworks-dark uppercase tracking-tight">{profile?.full_name}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${isViewingAdmin ? 'text-orange-500' : 'text-adworks-blue'}`}>
                    {isViewingAdmin ? (isMaster ? 'Master Admin' : 'Operador') : 'Cliente'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-10 h-10 rounded-xl bg-adworks-gray text-gray-400 hover:text-red-500 transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children || <Outlet />}
      </main>

      {/* MOBILE NAV BOTTOM (Contextual) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 shadow-2xl">
         {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-adworks-blue' : 'text-gray-400'}`}>
                <item.icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
              </Link>
            )
         })}
      </div>
    </div>
  );
}
