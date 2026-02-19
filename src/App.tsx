import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';
import Pipeline from './pages/app/Pipeline';

// Placeholder Pages
const Overview = () => (
  <div className="text-xl font-bold uppercase tracking-tighter">Decision Board</div>
);
const Companies = () => (
  <div className="text-xl font-bold uppercase tracking-tighter">Company Directory</div>
);

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-black animate-pulse bg-slate-50 text-slate-300 tracking-[0.5em]">
        INITIALIZING...
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
