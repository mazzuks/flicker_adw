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

  // 👤 CLIENT MENU
  const clientNavItems = [
    { icon: Home, label: 'DASHBOARD', path: '/client', mobile: true },
    { icon: Package, label: 'ABERTURA', path: '/client/onboarding', mobile: false },
    { icon: CheckSquare, label: 'TAREFAS', path: '/client/tasks', mobile: true },
    { icon: Inbox, label: 'MENSAGENS', path: '/client/messages', mobile: true },
    { icon: Users, label: 'CRM', path: '/client/crm', mobile: true },
    { icon: FileText, label: 'FINANCEIRO', path: '/client/finance', mobile: true },
  ];

  // 🎧 OPERATOR MENU
  const operatorNavItems = [
    { icon: LayoutDashboard, label: 'MINHA FILA', path: '/operator', mobile: true },
    { icon: CheckSquare, label: 'TRABALHO', path: '/operator/tasks', mobile: true },
    { icon: FileText, label: 'CNPJ', path: '/operator/tickets/cnpj', mobile: false },
    { icon: Briefcase, label: 'INPI', path: '/operator/tickets/inpi', mobile: false },
    { icon: Inbox, label: 'FISCAL', path: '/operator/tickets/fiscal', mobile: false },
    { icon: Building2, label: 'CLIENTES', path: '/operator/clients', mobile: true },
  ];

  // 🛡️ MASTER MENU
  const masterNavItems = [
    { icon: Layers, label: 'OVERVIEW', path: '/master', mobile: true },
    { icon: Building2, label: 'CLIENTES', path: '/master/clients', mobile: true },
    { icon: Users, label: 'EQUIPE', path: '/master/team', mobile: false },
    { icon: BarChart3, label: 'MÉTRICAS', path: '/master/analytics', mobile: false },
    { icon: Settings, label: 'AJUSTES', path: '/master/settings', mobile: false },
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
    <div className="min-h-screen bg-adworks-gray flex flex-col font-sans">
      {/* ⚡ TOP GPS BAR (Based on Print) */}
      <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-2 text-white shadow-sm shrink-0 ${
        isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark border-b border-white/5' : 'bg-adworks-blue'
      }`}>
        <Zap className="w-3 h-3" />
        {isMasterPath ? 'Master Administration Control' : isOperatorPath ? 'Operator Workforce Domain' : 'Entrepreneur Portal Domain'}
      </div>

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-top duration-500 border-b border-orange-500">
          <Zap className="w-4 h-4 animate-pulse" />
          VISÃO DO CLIENTE ATIVA
          <button onClick={stopImpersonating} className="bg-white text-orange-600 px-4 py-1 rounded-full font-black text-[9px] hover:bg-orange-50 transition-all shadow-sm">VOLTAR AO ADMIN</button>
        </div>
      )}

      {/* 🚀 PREMIUM HEADER */}
      <nav className="bg-white border-b border-gray-100 shadow-adw-soft sticky top-0 z-50 h-20 flex items-center shrink-0">
        <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-12">
              {/* Logo Area */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105 ${
                  isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-adworks-dark' : 'bg-adworks-blue'
                } shadow-blue-500/20`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-adworks-dark italic uppercase">ADWORKS</span>
              </Link>

              {/* Menu Items (Pill Style from Print) */}
              <div className="hidden lg:flex items-center space-x-1 p-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[10px] tracking-widest ${
                        isActive 
                          ? `bg-${themeColor} text-white shadow-xl scale-105` 
                          : 'text-gray-400 hover:text-adworks-dark hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Profile Area */}
            <div className="flex items-center space-x-6">
              <NotificationCenter />

              <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-adworks-dark uppercase tracking-tight leading-none">{profile?.full_name}</p>
                  <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 ${
                    isMasterPath ? 'text-orange-600' : 'text-adworks-blue'
                  }`}>
                    {isMasterPath ? 'MASTER ADMIN' : isOperatorPath ? 'OPERADOR' : 'CLIENTE'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-10 h-10 rounded-xl bg-adworks-gray text-gray-400 hover:text-red-500 transition-all flex items-center justify-center border border-transparent hover:border-red-50 hover:shadow-inner"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto w-full px-6 lg:px-10 py-10 flex-1 overflow-x-hidden">
        {children || <Outlet />}
        <div className="h-20 lg:hidden" />
      </main>

      {/* 📱 MOBILE NAV BOTTOM */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-around items-center z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
         {mobileNavItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1.5 ${
                isActive ? `text-${themeColor}` : 'text-gray-400'
              }`}>
                <item.icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110 shadow-lg' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
              </Link>
            )
         })}
      </div>
    </div>
  );
}
