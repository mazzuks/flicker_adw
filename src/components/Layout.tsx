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
  UserCircle,
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

  // 👤 CAIXINHA DO CLIENTE (Visão do que ele tem, sem edição)
  const clientNavItems = [
    { icon: Home, label: 'PAINEL', path: '/client' },
    { icon: Globe, label: 'SITE ATIVO', path: '/client/site' },
    { icon: Inbox, label: 'CORREIO', path: '/client/messages' },
    { icon: CheckSquare, label: 'ATIVIDADES', path: '/client/tasks' },
    { icon: Users, label: 'CONTATOS', path: '/client/crm' },
    { icon: FileText, label: 'FINANCEIRO', path: '/client/finance' },
  ];

  // 🎧 CAIXINHA DO OPERADOR (Acesso ao Builder aqui!)
  const operatorNavItems = [
    { icon: LayoutDashboard, label: 'VISÃO GERAL', path: '/operator' },
    { icon: Globe, label: 'SITE BUILDER', path: '/operator/site' },
    { icon: CheckSquare, label: 'TRABALHO', path: '/operator/tasks' },
    { icon: FileText, label: 'CNPJ', path: '/operator/tickets/cnpj' },
    { icon: Briefcase, label: 'INPI', path: '/operator/tickets/inpi' },
    { icon: Inbox, label: 'MENSAGENS', path: '/operator/messages' },
    { icon: Building2, label: 'CLIENTES', path: '/operator/clients' },
  ];

  // 🛡️ CAIXINHA DO MASTER (Acesso total)
  const masterNavItems = [
    { icon: Layers, label: 'VISÃO GERAL', path: '/master' },
    { icon: Globe, label: 'SITE BUILDER', path: '/master/site' },
    { icon: Building2, label: 'CLIENTES', path: '/master/clients' },
    { icon: Users, label: 'EQUIPE', path: '/master/team' },
    { icon: BarChart3, label: 'MÉTRICAS', path: '/master/analytics' },
    { icon: Inbox, label: 'MENSAGENS', path: '/master/messages' },
    { icon: Settings, label: 'CONFIGURAÇÕES', path: '/master/settings' },
  ];

  const navItems = isMasterPath ? masterNavItems : (isOperatorPath ? operatorNavItems : clientNavItems);
  const isImpersonating = isAdworks && currentClientId && isClientPath;

  const getRootLink = () => {
    if (isMasterPath) return '/master';
    if (isOperatorPath) return '/operator';
    if (isClientPath) return '/client';
    return '/';
  };

  const getThemeColor = () => {
    if (isMasterPath) return 'orange-600';
    if (isOperatorPath) return 'adworks-dark';
    return 'adworks-blue';
  };

  const themeColor = getThemeColor();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans selection:bg-adworks-blue selection:text-white">
      <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 text-white shrink-0 ${
        isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-[#1E293B]' : 'bg-adworks-blue'
      }`}>
        <Zap className="w-3 h-3 text-adworks-blue" />
        {isMasterPath ? 'Controle de Administração Master' : isOperatorPath ? 'Domínio de Força de Trabalho' : 'Domínio do Portal do Empreendedor'}
      </div>

      {isImpersonating && (
        <div className="bg-orange-600 text-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-top duration-500">
          <Zap className="w-4 h-4 animate-pulse" />
          VISÃO DO CLIENTE ATIVA
          <button onClick={stopImpersonating} className="bg-white text-orange-600 px-3 py-1 rounded font-black text-[9px]">VOLTAR</button>
        </div>
      )}

      <nav className="bg-[#2D3E50] border-b border-white/5 sticky top-0 z-50 h-[64px] flex items-center shrink-0 shadow-lg">
        <div className="max-w-full mx-auto w-full px-4">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-8 h-full">
              <Link to={getRootLink()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                  isMasterPath ? 'bg-orange-600' : isOperatorPath ? 'bg-[#1E293B] border border-white/10' : 'bg-adworks-blue'
                }`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tighter">adworks</span>
              </Link>

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
                      <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-adworks-blue shadow-[0_-5px_10px_rgba(0,71,255,0.5)]"></div>}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all"><NotificationCenter /></div>
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-white leading-none">{profile?.full_name?.toUpperCase()}</p>
                  <p className={`text-[9px] font-bold text-adworks-blue uppercase tracking-widest mt-1`}>
                    {isMasterPath ? 'Conta Master' : isOperatorPath ? 'Conta Operador' : 'Conta Cliente'}
                  </p>
                </div>
                <div className="w-9 h-9 bg-adworks-blue/20 rounded-full border-2 border-adworks-blue flex items-center justify-center overflow-hidden">
                   <UserCircle className="w-full h-full text-adworks-blue" />
                </div>
                <button onClick={handleSignOut} className="w-8 h-8 text-white/40 hover:text-red-400 transition-all flex items-center justify-center"><LogOut className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto w-full px-4 lg:px-8 py-8 flex-1 overflow-x-hidden">
        {children || <Outlet />}
      </main>
    </div>
  );
}
