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
import { Tasks as ClientTasks } from './pages/client/Tasks';
import { Inbox as ClientInbox } from './pages/client/Inbox';
import { CRM as ClientCRM } from './pages/client/CRM';
import { Finance as ClientFinance } from './pages/client/Finance';
import ClientAccount from './pages/client/Account';
import ClientTeam from './pages/client/Team';
import { Documents as ClientDocuments } from './pages/client/Documents';

// 🎧 OPERATOR DOMAIN COMPONENTS
import { AdworksDashboard } from './pages/adworks/AdworksDashboard';
import { AdworksTasks } from './pages/adworks/AdworksTasks';
import { AdworksTeam } from './pages/adworks/AdworksTeam';
import { Inbox as OperatorInbox } from './pages/client/Inbox';
import { Clients as ClientsList } from './pages/adworks/Clients';
import { TicketsCNPJ } from './pages/adworks/TicketsCNPJ';
import { TicketsFiscal } from './pages/adworks/TicketsFiscal';
import { TicketsINPI } from './pages/adworks/TicketsINPI';

/**
 * 🏢 ARQUITETURA DE TRÊS CAIXAS (DOMÍNIOS ISOLADOS)
 * 1. /master   -> Gestão Total (Admins)
 * 2. /operator -> Fila de Trabalho (Equipe)
 * 3. /client   -> Painel da Empresa (Clientes)
 */

function RootRedirect() {
  const { profile, currentClientId } = useAuth();
  
  if (profile?.role_global === 'ADWORKS_SUPERADMIN' && !currentClientId) {
    return <Navigate to="/master" replace />;
  }
  
  if (profile?.role_global?.startsWith('OPERATOR_') || profile?.role_global === 'ADWORKS_ADMIN') {
    return <Navigate to="/operator" replace />;
  }
  
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
          </Route>
        )}

        {/* 🛡️ CAIXINHA DO MASTER (/master) */}
        {isMaster && (
          <Route path="master">
            <Route index element={<AdworksDashboard />} /> {/* Master Dashboard especializado em breve */}
            <Route path="clients" element={<ClientsList />} />
            <Route path="team" element={<AdworksTeam />} />
            <Route path="analytics" element={<div className="p-20 text-center font-black opacity-20">Master Analytics Area</div>} />
            <Route path="settings" element={<div className="p-20 text-center font-black opacity-20">Global Configuration</div>} />
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
