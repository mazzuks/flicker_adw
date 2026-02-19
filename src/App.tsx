import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { LeadForm } from './pages/public/LeadForm';

// 👤 CLIENT DOMAIN COMPONENTS
import { Dashboard as ClientDashboard } from './pages/client/Dashboard';
import { Onboarding as ClientOnboarding } from './pages/client/Onboarding';
import { Documents as ClientDocuments } from './pages/client/Documents';
import { Tasks as ClientTasks } from './pages/client/Tasks';
import { Inbox as ClientInbox } from './pages/client/Inbox';
import { CRM as ClientCRM } from './pages/client/CRM';
import { Finance as ClientFinance } from './pages/client/Finance';
import ClientAccount from './pages/client/Account';
import ClientTeam from './pages/client/Team';

// 🎧 OPERATOR & MASTER COMPONENTS (Unified)
import { 
  AdworksDashboard, 
  AdworksTasks, 
  AdworksTeam, 
  Clients as ClientsList, 
  TicketsCNPJ, 
  TicketsFiscal, 
  TicketsINPI, 
  MasterSettings,
  MasterDashboard,
  MasterAnalytics,
  OperatorInbox
} from './pages/adworks';

import { SiteBuilder } from './pages/client/site/SiteBuilder';

/**
 * 🏢 ARQUITETURA DE TRÊS CAIXAS (DOMÍNIOS ISOLADOS)
 * 1. /master   -> Gestão Total (Admins)
 * 2. /operator -> Fila de Trabalho (Equipe)
 * 3. /client   -> Painel da Empresa (Clientes)
 */

function RootRedirect() {
  const { profile, currentClientId } = useAuth();
  if (profile?.role_global === 'ADWORKS_SUPERADMIN' && !currentClientId) return <Navigate to="/master" replace />;
  if (profile?.role_global?.startsWith('OPERATOR_') || profile?.role_global === 'ADWORKS_ADMIN') return <Navigate to="/operator" replace />;
  return <Navigate to="/client" replace />;
}

function AppRoutes() {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-adworks-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  const isMaster = profile?.role_global === 'ADWORKS_SUPERADMIN';
  const isStaff = isMaster || profile?.role_global === 'ADWORKS_ADMIN' || profile?.role_global?.startsWith('OPERATOR_');

  return (
    <Routes>
      <Route path="/f/:clientSlug/:formId" element={<LeadForm />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<RootRedirect />} />

        {/* 👤 CAIXINHA DO CLIENTE (/client) */}
        <Route path="client">
          <Route index element={<ClientDashboard />} />
          <Route path="onboarding" element={<ClientOnboarding />} />
          <Route path="documents" element={<ClientDocuments />} />
          <Route path="tasks" element={<ClientTasks />} />
          <Route path="messages" element={<ClientInbox />} />
          <Route path="crm" element={<ClientCRM />} />
          <Route path="finance" element={<ClientFinance />} />
          <Route path="account" element={<ClientAccount />} />
          <Route path="team" element={<ClientTeam />} />
          <Route path="site" element={<div className="p-20 text-center font-black italic opacity-20 uppercase tracking-tighter">Site View Mode em breve</div>} />
        </Route>

        {/* 🎧 CAIXINHA DO OPERADOR (/operator) */}
        {isStaff && (
          <Route path="operator">
            <Route index element={<AdworksDashboard />} />
            <Route path="tasks" element={<AdworksTasks />} />
            <Route path="tickets/cnpj" element={<TicketsCNPJ />} />
            <Route path="tickets/inpi" element={<TicketsINPI />} />
            <Route path="tickets/fiscal" element={<TicketsFiscal />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="messages" element={<OperatorInbox />} />
            <Route path="site" element={<SiteBuilder />} />
          </Route>
        )}

        {/* 🛡️ CAIXINHA DO MASTER (/master) */}
        {isMaster && (
          <Route path="master">
            <Route index element={<MasterDashboard />} /> 
            <Route path="tasks" element={<AdworksTasks />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="team" element={<AdworksTeam />} />
            <Route path="settings" element={<MasterSettings />} />
            <Route path="analytics" element={<MasterAnalytics />} />
            <Route path="messages" element={<OperatorInbox />} />
            <Route path="site" element={<SiteBuilder />} />
          </Route>
        )}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
