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
  Package,
  Layers
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
    navigate('/master');
  };

  // 1. IDENTIFICAÇÃO DA CAIXINHA ATUAL VIA URL
  const isMasterPath = location.pathname.startsWith('/master');
  const isOperatorPath = location.pathname.startsWith('/operator');
  const isClientPath = location.pathname.startsWith('/client');

  // 👤 CAIXINHA DO CLIENTE
  const clientNavItems = [
    { icon: Home, label: 'Dashboard', path: '/client' },
    { icon: Package, label: 'Onboarding', path: '/client/onboarding' },
    { icon: CheckSquare, label: 'Tarefas', path: '/client/tasks' },
    { icon: Inbox, label: 'Mensagens', path: '/client/messages' },
    { icon: Users, label: 'CRM', path: '/client/crm' },
    { icon: FileText, label: 'Financeiro', path: '/client/finance' },
  ];

  // 🎧 CAIXINHA DO OPERADOR
  const operatorNavItems = [
    { icon: LayoutDashboard, label: 'Minha Fila', path: '/operator' },
    { icon: CheckSquare, label: 'Trabalho', path: '/operator/tasks' },
    { icon: FileText, label: 'CNPJ', path: '/operator/tickets/cnpj' },
    { icon: Briefcase, label: 'INPI', path: '/operator/tickets/inpi' },
    { icon: Inbox, label: 'Fiscal', path: '/operator/tickets/fiscal' },
    { icon: Building2, label: 'Clientes', path: '/operator/clients' },
  ];

  // 🛡️ CAIXINHA DO MASTER
  const masterNavItems = [
    { icon: Layers, label: 'Overview', path: '/master' },
    { icon: Building2, label: 'Clientes', path: '/master/clients' },
    { icon: Users, label: 'Equipe', path: '/master/team' },
    { icon: BarChart3, label: 'Métricas', path: '/master/analytics' },
    { icon: Settings, label: 'Ajustes', path: '/master/settings' },
  ];

  // Definição contextual do Menu
  const navItems = isMasterPath ? masterNavItems : (isOperatorPath ? operatorNavItems : clientNavItems);

  const isImpersonating = isAdworks && currentClientId && isClientPath;

  return (
    <div className="min-h-screen bg-adworks-gray">
      {/* INDICADOR DE CONTEXTO (GPS VISUAL) */}
      <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 text-white ${
        isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue'
      }`}>
        {isMasterPath ? (
          <><Zap className="w-3 h-3" /> Master Administration Control</>
        ) : isOperatorPath ? (
          <><ShieldCheck className="w-3 h-3 text-adworks-blue" /> Operator Workforce Domain</>
        ) : (
          <><Building2 className="w-3 h-3" /> Entrepreneur Portal</>
        )}
      </div>

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 shadow-2xl z-[100] relative animate-in slide-in-from-top duration-500 border-b border-orange-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            MODO IMPERSONAÇÃO: VOCÊ ESTÁ VENDO COMO CLIENTE
          </div>
          <button 
            onClick={stopImpersonating}
            className="bg-white text-orange-600 px-4 py-1.5 rounded-full font-black hover:bg-orange-50 transition-all shadow-sm active:scale-95"
          >
            VOLTAR AO MASTER
          </button>
        </div>
      )}

      <nav className="bg-white border-b border-gray-100 shadow-adw-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                  isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue'
                } shadow-blue-500/20`}>
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
                          ? (isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue') + ' text-white shadow-xl scale-105' 
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
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${
                    isMasterPath ? 'text-orange-600' : isOperatorPath ? 'text-adworks-blue opacity-100' : 'text-adworks-blue'
                  }`}>
                    {isMasterPath ? 'Master Admin' : isOperatorPath ? 'Operador' : 'Cliente'}
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
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${
                isActive ? (isMasterPath ? 'text-orange-600' : isOperatorPath ? 'text-adworks-dark' : 'text-adworks-blue') : 'text-gray-400'
              }`}>
                <item.icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
              </Link>
            )
         })}
      </div>
    </div>
  );
}
