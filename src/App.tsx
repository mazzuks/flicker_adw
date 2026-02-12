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
import ClientsList from './pages/adworks/Clients';
import { TicketsCNPJ } from './pages/adworks/TicketsCNPJ';
import TicketsFiscal from './pages/adworks/TicketsFiscal';
import TicketsINPI from './pages/adworks/TicketsINPI';

function RootRedirect() {
  const { isAdworks, currentClientId } = useAuth();
  // Se for equipe e não estiver vendo como cliente, joga para a caixinha Admin
  if (isAdworks && !currentClientId) return <Navigate to="/admin" replace />;
  // Se for cliente, joga para a caixinha App
  return <Navigate to="/app" replace />;
}

function AppRoutes() {
  const { user, loading, isAdworks } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/f/:clientSlug/:formId" element={<LeadForm />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔐 DOMÍNIOS PROTEGIDOS */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Redirecionamento de Entrada */}
        <Route index element={<RootRedirect />} />

        {/* 👤 CAIXINHA DO CLIENTE (/app) */}
        <Route path="app">
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

        {/* 🎧 CAIXINHA DO OPERADOR/ADMIN (/admin) */}
        {isAdworks && (
          <Route path="admin">
            <Route index element={<AdworksDashboard />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="team" element={<AdworksTeam />} />
            <Route path="tasks" element={<AdworksTasks />} />
            <Route path="messages" element={<OperatorInbox />} />
            <Route path="tickets/cnpj" element={<TicketsCNPJ />} />
            <Route path="tickets/inpi" element={<TicketsINPI />} />
            <Route path="tickets/fiscal" element={<TicketsFiscal />} />
            <Route path="analytics" element={<div className="p-12 text-center font-black uppercase italic opacity-20">Analytics Area (Fase 2)</div>} />
            <Route path="settings" element={<div className="p-12 text-center font-black uppercase italic opacity-20">Master Settings (Fase 2)</div>} />
          </Route>
        )}
      </Route>

      {/* Fallback de rotas não encontradas */}
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
