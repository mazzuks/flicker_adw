import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, signOut, isAdworks } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const clientNavItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
    { icon: Inbox, label: 'Mensagens', path: '/inbox' },
    { icon: Users, label: 'CRM', path: '/crm' },
    { icon: User, label: 'Conta', path: '/account' },
  ];

  const adworksNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/adworks' },
    { icon: Building2, label: 'Clientes', path: '/adworks/clients' },
    { icon: FileText, label: 'Tickets CNPJ', path: '/adworks/tickets/cnpj' },
    { icon: Briefcase, label: 'Tickets INPI', path: '/adworks/tickets/inpi' },
    { icon: Inbox, label: 'Fiscal', path: '/adworks/fiscal' },
    { icon: Settings, label: 'Configurações', path: '/adworks/settings' },
  ];

  const navItems = isAdworks ? adworksNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Adworks</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || profile?.email}</p>
                  <p className="text-xs text-gray-500">{profile?.role_global}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {!isAdworks && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-3 px-4 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdworks && (
          <div className="mb-6">
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <main>{children}</main>
      </div>
    </div>
  );
}
