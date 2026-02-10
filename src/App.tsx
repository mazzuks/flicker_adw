import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Dashboard } from './pages/client/Dashboard';
import { Onboarding } from './pages/client/Onboarding';
import { CRM } from './pages/client/CRM';
import { Documents } from './pages/client/Documents';
import { Tasks } from './pages/client/Tasks';
import { Inbox } from './pages/client/Inbox';
import Account from './pages/client/Account';
import Team from './pages/client/Team';
import { LeadForm } from './pages/public/LeadForm';
import { AdworksDashboard } from './pages/adworks/AdworksDashboard';
import { TicketsCNPJ } from './pages/adworks/TicketsCNPJ';
import TicketsFiscal from './pages/adworks/TicketsFiscal';
import TicketsINPI from './pages/adworks/TicketsINPI';
import Clients from './pages/adworks/Clients';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/f/:clientSlug/:formId" element={<LeadForm />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/account" element={<Account />} />
                <Route path="/team" element={<Team />} />

                <Route path="/adworks" element={<AdworksDashboard />} />
                <Route path="/adworks/tickets/cnpj" element={<TicketsCNPJ />} />
                <Route path="/adworks/tickets/inpi" element={<TicketsINPI />} />
                <Route path="/adworks/tickets/fiscal" element={<TicketsFiscal />} />
                <Route path="/adworks/clients" element={<Clients />} />
                <Route path="/adworks/settings" element={<div className="text-center py-12">Configurações em breve</div>} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
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
