import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';
import Pipeline from './pages/app/Pipeline';
import { Overview } from './pages/app/Overview';
import { Settings } from './pages/app/Settings';

import { TempleteriaWizard } from './pages/app/TempleteriaWizard';
import { TempleteriaRefiner } from './pages/app/TempleteriaRefiner';
import { PublicSiteView } from './pages/public/PublicSiteView';

const queryClient = new QueryClient();

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
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/app/overview" replace />} />

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
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route
          path="companies"
          element={
            <div className="p-10 text-xl font-black uppercase italic opacity-20">
              Company Directory
            </div>
          }
        />
        <Route
          path="inbox"
          element={
            <div className="p-10 text-xl font-black uppercase italic opacity-20">Inbox Area</div>
          }
        />
        <Route path="settings" element={<Settings />} />
        <Route path="templeteria/wizard" element={<TempleteriaWizard />} />
        <Route path="refiner/:siteId" element={<TempleteriaRefiner />} />
      </Route>

      <Route path="/s/:slug" element={<PublicSiteView />} />

      <Route path="*" element={<Navigate to="/app/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
