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
  Layers,
  Globe
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

  const isMasterPath = location.pathname.startsWith('/master');
  const isOperatorPath = location.pathname.startsWith('/operator');
  const isClientPath = location.pathname.startsWith('/client');

  // 👤 CAIXINHA DO CLIENTE
  const clientNavItems = [
    { icon: Home, label: 'Início', path: '/client', mobile: true },
    { icon: Package, label: 'Abertura', path: '/client/onboarding', mobile: false },
    { icon: CheckSquare, label: 'Tarefas', path: '/client/tasks', mobile: true },
    { icon: Inbox, label: 'Mensagens', path: '/client/messages', mobile: true },
    { icon: Users, label: 'CRM', path: '/client/crm', mobile: true },
    { icon: FileText, label: 'Financeiro', path: '/client/finance', mobile: true },
    { icon: Globe, label: 'Meu Site', path: '/client/site', mobile: false },
  ];

  // 🎧 CAIXINHA DO OPERADOR
  const operatorNavItems = [
    { icon: LayoutDashboard, label: 'Minha Fila', path: '/operator', mobile: true },
    { icon: CheckSquare, label: 'Trabalho', path: '/operator/tasks', mobile: true },
    { icon: FileText, label: 'CNPJ', path: '/operator/tickets/cnpj', mobile: false },
    { icon: Briefcase, label: 'INPI', path: '/operator/tickets/inpi', mobile: false },
    { icon: Inbox, label: 'Fiscal', path: '/operator/tickets/fiscal', mobile: false },
    { icon: Building2, label: 'Clientes', path: '/operator/clients', mobile: true },
    { icon: Inbox, label: 'Chat Global', path: '/operator/messages', mobile: true },
  ];

  // 🛡️ CAIXINHA DO MASTER
  const masterNavItems = [
    { icon: Layers, label: 'Overview', path: '/master', mobile: true },
    { icon: CheckSquare, label: 'Tarefas', path: '/master/tasks', mobile: true },
    { icon: Building2, label: 'Clientes', path: '/master/clients', mobile: true },
    { icon: Users, label: 'Equipe', path: '/master/team', mobile: false },
    { icon: BarChart3, label: 'Métricas', path: '/master/analytics', mobile: false },
    { icon: Settings, label: 'Ajustes', path: '/master/settings', mobile: false },
  ];

  const navItems = isMasterPath ? masterNavItems : (isOperatorPath ? operatorNavItems : clientNavItems);
  const mobileNavItems = navItems.filter(item => item.mobile);

  const isImpersonating = isAdworks && currentClientId && isClientPath;

  const getThemeColor = () => {
    if (isMasterPath) return 'orange-600';
    if (isOperatorPath) return 'adworks-dark';
    return 'adworks-blue';
  };

  const themeColor = getThemeColor();

  return (
    <div className="min-h-screen bg-adworks-gray flex flex-col">
      {/* ⚡ TOP GPS Indicator (Fixed on mobile too) */}
      <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 text-white shadow-sm shrink-0 ${
        isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue'
      }`}>
        {isMasterPath ? (
          <><Zap className="w-3 h-3" /> Master Admin</>
        ) : isOperatorPath ? (
          <><ShieldCheck className="w-3 h-3" /> Operator</>
        ) : (
          <><Building2 className="w-3 h-3" /> Entrepreneur</>
        )}
      </div>

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-top duration-500">
          <Zap className="w-4 h-4 animate-pulse" />
          VISÃO DO CLIENTE
          <button onClick={stopImpersonating} className="bg-white text-orange-600 px-3 py-1 rounded-lg font-black text-[9px]">SAIR</button>
        </div>
      )}

      {/* 🚀 MODERN NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-100 shadow-adw-soft sticky top-0 z-50 h-16 lg:h-24 flex items-center shrink-0">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 lg:gap-12">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105 ${
                  isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue'
                } shadow-blue-500/20`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg lg:text-2xl font-black tracking-tighter text-adworks-dark italic uppercase">ADWORKS</span>
              </Link>

              <div className="hidden lg:flex items-center space-x-1 bg-adworks-gray/50 p-1.5 rounded-[1.5rem]">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? `bg-${themeColor} text-white shadow-xl scale-105` 
                          : 'text-gray-400 hover:text-adworks-dark'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-8">
              <NotificationCenter />
              <div className="flex items-center gap-3 lg:gap-5 pl-4 lg:pl-8 border-l border-gray-100">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-adworks-dark uppercase tracking-tighter leading-none">{profile?.full_name}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-adworks-gray text-gray-400 hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-12 flex-1 overflow-x-hidden">
        {children || <Outlet />}
        {/* Spacer for mobile bottom nav */}
        <div className="h-24 lg:hidden" />
      </main>

      {/* 📱 MOBILE NAV BOTTOM */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
         {mobileNavItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${
                isActive ? `text-${themeColor}` : 'text-gray-400'
              }`}>
                <item.icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
              </Link>
            )
         })}
      </div>
    </div>
  );
}
