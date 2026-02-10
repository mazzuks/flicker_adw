import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/client/Dashboard';
import { Onboarding } from './pages/client/Onboarding';
import { CRM } from './pages/client/CRM';
import { Documents } from './pages/client/Documents';
import { Tasks } from './pages/client/Tasks';
import { Inbox } from './pages/client/Inbox';
import { LeadForm } from './pages/public/LeadForm';
import { AdworksDashboard } from './pages/adworks/AdworksDashboard';
import { TicketsCNPJ } from './pages/adworks/TicketsCNPJ';

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
                <Route path="/account" element={<div className="text-center py-12">Conta em breve</div>} />

                <Route path="/adworks" element={<AdworksDashboard />} />
                <Route path="/adworks/tickets/cnpj" element={<TicketsCNPJ />} />
                <Route path="/adworks/tickets/inpi" element={<TicketsCNPJ />} />
                <Route path="/adworks/fiscal" element={<div className="text-center py-12">Fiscal em breve</div>} />
                <Route path="/adworks/clients" element={<div className="text-center py-12">Clientes em breve</div>} />
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
