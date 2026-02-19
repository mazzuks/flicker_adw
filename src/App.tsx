import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';

// Placeholder Pages
const Overview = () => <div className="text-xl font-bold">Overview Board</div>;
const Pipeline = () => <div className="text-xl font-bold italic">Strategic Pipeline (Kanban)</div>;
const Companies = () => <div className="text-xl font-bold">Company Directory</div>;

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-bold animate-pulse">
        BOOTING SYSTEM...
      </div>
    );

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/app/pipeline" replace />} />

      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppShell>
              <Outlet />
            </AppShell>
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/app/pipeline" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="companies" element={<Companies />} />
        <Route path="inbox" element={<div>Inbox Area</div>} />
        <Route path="settings" element={<div>Settings Area</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/app/pipeline" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
