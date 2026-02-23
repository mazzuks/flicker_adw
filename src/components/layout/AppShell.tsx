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
  CheckSquare,
  FileSpreadsheet,
  ClipboardCheck,
  TrendingUp,
  ShieldCheck,
  FileText,
  Globe,
  Home,
  Plus,
  Layout,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText as DocIcon
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useUIStore } from '../../store/useUIStore';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, signOut, isAdworks } = useAuth();
  const { closeDrawer } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const isSuperAdmin = profile?.role_global === 'ADWORKS_SUPERADMIN';

  const commonItems = [
    { icon: Home, label: 'Home', path: '/app/home' },
  ];

  const templeteriaItems = [
    { icon: Globe, label: 'Templeteria', path: '/app/templeteria' },
    { icon: Layout, label: 'Sites', path: '/app/templeteria/sites', isSubItem: true },
    { icon: Plus, label: 'Criar site', path: '/app/templeteria/wizard', isSubItem: true },
  ];

  const clientItems = [
    ...commonItems,
    { icon: LayoutDashboard, label: 'Overview', path: '/app/overview' },
    ...templeteriaItems,
    { icon: Layers, label: 'Pipeline', path: '/app/pipeline' },
    { icon: Building2, label: 'Companies', path: '/app/companies' },
    { icon: Calendar, label: 'Agenda Fiscal', path: '/app/company/agenda-fiscal' },
    { icon: CheckSquare, label: 'Ativacao', path: '/app/company/checklist' },
    { icon: FileSpreadsheet, label: 'Notas Fiscais', path: '/app/company/nf-requests' },
    { icon: FileText, label: 'Guia DAS', path: '/app/company/das' },
    { icon: TrendingUp, label: 'Financas', path: '/app/company/finance' },
    { icon: InboxIcon, label: 'Inbox', path: '/app/inbox' },
    { icon: SettingsIcon, label: 'Settings', path: '/app/settings' },
  ];

  const operatorItems = [
    ...commonItems,
    { icon: LayoutDashboard, label: 'Overview', path: '/app/overview' },
    ...templeteriaItems,
    { icon: Layers, label: 'Pipeline', path: '/app/pipeline' },
    { icon: ClipboardCheck, label: 'Fila Fiscal', path: '/app/operator/fiscal-queue' },
    { icon: InboxIcon, label: 'Inbox', path: '/app/inbox' },
    { icon: SettingsIcon, label: 'Settings', path: '/app/settings' },
  ];

  const adminItems = [
    ...commonItems,
    { icon: ShieldCheck, label: 'Admin BI', path: '/app/admin/finance' },
    { icon: LayoutDashboard, label: 'Overview', path: '/app/overview' },
    ...templeteriaItems,
    { icon: Layers, label: 'Pipeline', path: '/app/pipeline' },
    { icon: ClipboardCheck, label: 'Fila Fiscal', path: '/app/operator/fiscal-queue' },
    { icon: InboxIcon, label: 'Inbox', path: '/app/inbox' },
    { icon: SettingsIcon, label: 'Settings', path: '/app/settings' },
  ];

  const navItems = isSuperAdmin ? adminItems : (isAdworks ? operatorItems : clientItems);

  // 1. Global Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase.rpc('global_search', { p_query: searchQuery });
        if (!error) {
          setSearchResults(data || []);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 2. Real-time Notifications
  useEffect(() => {
    if (!profile?.account_id) return;
    
    loadNotifications();

    const subscription = supabase
      .channel('realtime_notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `account_id=eq.${profile.account_id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [profile?.account_id]);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setNotifications(data || []);
  };

  const markAllAsRead = async () => {
    if (!profile?.account_id) return;
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('account_id', profile.account_id)
      .is('read_at', null);
    loadNotifications();
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <span className="font-bold tracking-tight text-lg italic uppercase leading-none">ADWORKS</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isSubItem = (item as any).isSubItem;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#5B6475] hover:bg-[#F7F8FA] hover:text-[#0B1220]'
                } ${isSubItem ? 'ml-6 py-1.5 opacity-80' : ''}`}
              >
                <item.icon
                  className={`${isSubItem ? 'w-3.5 h-3.5' : 'w-5 h-5'} shrink-0 ${isActive ? 'text-[#2563EB]' : 'group-hover:text-[#0B1220]'}`}
                />
                <span className={`${isSubItem ? 'text-xs' : 'text-sm'} font-semibold`}>{item.label}</span>
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
            <span className="text-xs font-bold uppercase tracking-widest leading-none">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-[#E6E8EC] flex items-center px-8 justify-between shrink-0 relative z-50">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-1">
              <Menu className="w-5 h-5 text-[#5B6475]" />
            </div>
            
            {/* SEARCH BOX */}
            <div ref={searchRef} className="relative max-w-md w-full group">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${showResults ? 'text-blue-600' : 'text-[#5B6475]'}`} />
                <input
                  type="text"
                  placeholder="Global Search... (⌘K)"
                  className="w-full pl-10 pr-10 py-2 bg-[#F7F8FA] border-none rounded-xl text-sm font-medium focus:ring-1 focus:ring-[#2563EB] outline-none"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500 animate-spin" />}
              </div>

              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Resultados da Busca</span>
                   </div>
                   <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {searchResults.map((res, i) => (
                        <button 
                          key={i} 
                          onClick={() => { navigate(res.path); setShowResults(false); setSearchQuery(''); }}
                          className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-all text-left group"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm">
                                 {res.type === 'company' ? <Building2 className="w-4 h-4 text-blue-600" /> : <Globe className="w-4 h-4 text-emerald-600" />}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-800 uppercase italic leading-none">{res.title}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1.5 tracking-tight">{res.subtitle}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-all" />
                        </button>
                      ))}
                      {searchResults.length === 0 && !isSearching && (
                        <div className="p-8 text-center">
                           <p className="text-[10px] font-bold text-slate-300 uppercase italic">Nenhum registro encontrado</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 pl-4">
            {/* NOTIFICATIONS BELL */}
            <div ref={notifRef} className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); if(!showNotifications) markAllAsRead(); }}
                className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-[#5B6475] hover:bg-slate-50'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Notificacoes</span>
                      <Badge variant="neutral" className="text-[8px]">{unreadCount} novas</Badge>
                   </div>
                   <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                      {notifications.map((n) => (
                        <button 
                          key={n.id} 
                          onClick={() => { if(n.link) navigate(n.link); setShowNotifications(false); }}
                          className="w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-all text-left group"
                        >
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'fiscal' ? 'bg-red-50 text-red-500' : n.type === 'message' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                              {n.type === 'message' ? <InboxIcon className="w-4 h-4" /> : n.type === 'fiscal' ? <AlertCircle className="w-4 h-4" /> : <DocIcon className="w-4 h-4" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold text-slate-800 leading-snug uppercase italic ${!n.read_at ? 'text-blue-600' : ''}`}>{n.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed truncate">{n.body}</p>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2 block">
                                 {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                        </button>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-10 text-center space-y-3">
                           <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto" />
                           <p className="text-[10px] font-bold text-slate-300 uppercase italic">Tudo limpo por aqui</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-[#E6E8EC]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#0B1220] leading-none uppercase italic">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest mt-1">
                  {profile?.role_global}
                </p>
              </div>
              <div className="w-9 h-9 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center font-black text-[10px] text-slate-400 shadow-inner">
                 {profile?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F7F8FA]">{children}</main>
      </div>

      <div onClick={closeDrawer} className="hidden" />
    </div>
  );
}
