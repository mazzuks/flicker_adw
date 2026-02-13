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
  Search,
  Bell,
  UserCircle
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

  const clientNavItems = [
    { icon: Home, label: 'Negócios', path: '/client' },
    { icon: Inbox, label: 'Correio', path: '/client/messages' },
    { icon: CheckSquare, label: 'Atividades', path: '/client/tasks' },
    { icon: Users, label: 'Contatos', path: '/client/crm' },
    { icon: FileText, label: 'Financeiro', path: '/client/finance' },
  ];

  const adworksNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/operator' },
    { icon: CheckSquare, label: 'Deals', path: '/operator/tasks' },
    { icon: Building2, label: 'Agents', path: '/operator/clients' },
    { icon: Inbox, label: 'Messaging', path: '/operator/messages' },
  ];

  const masterNavItems = [
    { icon: Layers, label: 'Overview', path: '/master' },
    { icon: Building2, label: 'Clients', path: '/master/clients' },
    { icon: Users, label: 'Team', path: '/master/team' },
    { icon: BarChart3, label: 'Analytics', path: '/master/analytics' },
    { icon: Settings, label: 'Setup Dashboard', path: '/master/settings' },
  ];

  const navItems = isMasterPath ? masterNavItems : (isOperatorPath ? operatorNavItems : clientNavItems);
  const isImpersonating = isAdworks && currentClientId && isClientPath;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans selection:bg-adworks-blue selection:text-white">
      {/* ⚡ TOP NANO BAR (GPS) */}
      <div className="bg-[#1E293B] px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 text-white/60 shrink-0">
        <Zap className="w-3 h-3 text-adworks-blue" />
        {isMasterPath ? 'Master Administration Control' : isOperatorPath ? 'Operator Workforce Domain' : 'Entrepreneur Portal Domain'}
      </div>

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-top duration-500">
          <Zap className="w-4 h-4 animate-pulse" />
          VISÃO DO CLIENTE ATIVA
          <button onClick={stopImpersonating} className="bg-white text-orange-600 px-3 py-1 rounded font-black text-[9px]">VOLTAR</button>
        </div>
      )}

      {/* 🚀 HIGH-FIDELITY NAVBAR (Inspired by Pipedrive Print) */}
      <nav className="bg-[#2D3E50] border-b border-white/5 sticky top-0 z-50 h-[64px] flex items-center shrink-0 shadow-lg">
        <div className="max-w-full mx-auto w-full px-4">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-8 h-full">
              {/* Logo Area */}
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-adworks-blue rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tighter">adworks</span>
              </Link>

              {/* Pipedrive Style Search Bar */}
              <div className="hidden xl:flex items-center relative group">
                <Search className="absolute left-3 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  className="bg-white/10 border-none rounded-md pl-10 pr-4 py-1.5 text-xs text-white placeholder-white/30 focus:ring-1 focus:ring-white/20 w-64 transition-all"
                />
              </div>

              {/* Menu Items (Top Row Style) */}
              <div className="hidden lg:flex items-center h-full">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex flex-col items-center justify-center px-4 h-[64px] transition-all relative group ${
                        isActive ? 'bg-[#3D5266] text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`} />
                      <span className="text-[10px] font-bold">{item.label}</span>
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-adworks-blue shadow-[0_-5px_10px_rgba(0,71,255,0.5)]"></div>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Profile Area (Top Right) */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <button className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all"><NotificationCenter /></button>
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-white leading-none">{profile?.full_name?.toUpperCase()}</p>
                  <p className="text-[9px] font-bold text-adworks-blue uppercase tracking-widest mt-1">Master Account</p>
                </div>
                <div className="w-9 h-9 bg-adworks-blue/20 rounded-full border-2 border-adworks-blue flex items-center justify-center overflow-hidden">
                   <UserCircle className="w-full h-full text-adworks-blue" />
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-8 h-8 text-white/40 hover:text-red-400 transition-all flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 📈 MAIN BOARD CONTENT */}
      <main className="max-w-[1600px] mx-auto w-full px-4 lg:px-8 py-8 flex-1 overflow-x-hidden">
        {children || <Outlet />}
      </main>

      {/* MOBILE NAV BOTTOM (Dark Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#2D3E50] border-t border-white/5 px-6 py-3 flex justify-around items-center z-50 shadow-2xl">
         {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-white' : 'text-white/40'
              }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-adworks-blue rounded-full mt-1"></div>}
              </Link>
            )
         })}
      </div>
    </div>
  );
}
