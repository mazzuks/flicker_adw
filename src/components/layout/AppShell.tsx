import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Building2,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useUIStore } from '../../store/useUIStore';

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/app/overview' },
    { icon: Layers, label: 'Pipeline', path: '/app/pipeline' },
    { icon: Building2, label: 'Companies', path: '/app/companies' },
    { icon: Inbox, label: 'Inbox', path: '/app/inbox' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold tracking-tighter text-lg uppercase italic">ADWORKS</span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'group-hover:text-slate-900'}`}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && (
              <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-900">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Busca global... (Ctrl+K)"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {profile?.role_global || 'Membro'}
              </p>
            </div>
            <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
