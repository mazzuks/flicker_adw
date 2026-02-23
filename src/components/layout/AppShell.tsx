import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Building2,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Search,
  Bell,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useUIStore } from '../../store/useUIStore';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const { closeDrawer } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/app/overview' },
    { icon: Layers, label: 'Pipeline', path: '/app/pipeline' },
    { icon: Building2, label: 'Companies', path: '/app/companies' },
    { icon: Calendar, label: 'Agenda Fiscal', path: '/app/company/agenda-fiscal' },
    { icon: CheckSquare, label: 'Ativacao', path: '/app/company/checklist' },
    { icon: InboxIcon, label: 'Inbox', path: '/app/inbox' },
    { icon: SettingsIcon, label: 'Settings', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex font-sans text-[#0B1220]">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-[#E6E8EC] transition-all duration-300 flex flex-col shrink-0 w-64`}
      >
        <div className="h-16 flex items-center px-6 border-b border-[#E6E8EC] gap-3">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg italic uppercase">ADWORKS</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#5B6475] hover:bg-[#F7F8FA] hover:text-[#0B1220]'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#2563EB]' : 'group-hover:text-[#0B1220]'}`}
                />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E6E8EC]">
          <button
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-[#5B6475] hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-[#E6E8EC] flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-1">
              <Menu className="w-5 h-5 text-[#5B6475]" />
            </div>
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6475] group-focus-within:text-[#2563EB]" />
              <input
                type="text"
                placeholder="Global Search... (⌘K)"
                className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 pl-4">
            <button className="text-[#5B6475] hover:text-[#0B1220] transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#E6E8EC]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#0B1220] leading-none">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest mt-1">
                  {profile?.role_global}
                </p>
              </div>
              <div className="w-9 h-9 bg-[#F7F8FA] rounded-full border border-[#E6E8EC]" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F7F8FA]">{children}</main>
      </div>

      <div onClick={closeDrawer} className="hidden" />
    </div>
  );
}
