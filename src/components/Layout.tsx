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
  Zap
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

  const clientNavItems = [
    { icon: Home, label: 'Início', path: '/app' },
    { icon: CheckSquare, label: 'Tarefas', path: '/app/tasks' },
    { icon: Inbox, label: 'Mensagens', path: '/app/messages' },
    { icon: Users, label: 'CRM', path: '/app/crm' },
    { icon: FileText, label: 'Financeiro', path: '/app/finance' },
    { icon: Users, label: 'Equipe', path: '/app/team' },
    { icon: User, label: 'Conta', path: '/app/account' },
  ];

  const adworksNavItems = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/admin' },
    { icon: Building2, label: 'Clientes', path: '/admin/clients' },
    { icon: CheckSquare, label: 'Trabalho', path: '/admin/tasks' },
    { icon: FileText, label: 'Tickets CNPJ', path: '/admin/tickets/cnpj' },
    { icon: Briefcase, label: 'Tickets INPI', path: '/admin/tickets/inpi' },
    { icon: Inbox, label: 'Tickets Fiscal', path: '/admin/tickets/fiscal' },
    { icon: Users, label: 'Time Adworks', path: '/admin/team' },
    { icon: Settings, label: 'Ajustes', path: '/admin/settings' },
  ];

  // Se a rota começa com /admin, usa menu de operador. Senão, menu de cliente.
  const isViewingAdmin = location.pathname.startsWith('/admin');
  const navItems = isViewingAdmin ? adworksNavItems : clientNavItems;

  const isImpersonating = isAdworks && currentClientId && !isViewingAdmin;

  return (
    <div className="min-h-screen bg-adworks-gray">
      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 shadow-2xl z-[100] relative animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            VENDO COMO CLIENTE
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
                <div className="w-12 h-12 bg-adworks-blue rounded-2xl flex items-center justify-center shadow-lg shadow-adworks-blue/20 group-hover:scale-105 transition-transform">
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
                  <p className="text-[9px] font-bold text-adworks-blue uppercase tracking-widest opacity-60">
                    {isViewingAdmin ? 'Nível Operador' : 'Nível Cliente'}
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
    </div>
  );
}
