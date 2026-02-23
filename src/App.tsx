import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';

// --- LAZY LOADED ROUTES (Performance Pass) ---
const Overview = lazy(() => import('./pages/app/Overview').then(m => ({ default: m.Overview })));
const Pipeline = lazy(() => import('./pages/app/Pipeline'));
const Settings = lazy(() => import('./pages/app/Settings').then(m => ({ default: m.Settings })));
const Companies = lazy(() => import('./pages/app/Companies').then(m => ({ default: m.Companies })));
const Inbox = lazy(() => import('./pages/app/Inbox').then(m => ({ default: m.Inbox })));

const TempleteriaDashboard = lazy(() => import('./pages/app/TempleteriaDashboard').then(m => ({ default: m.TempleteriaDashboard })));
const TempleteriaWizard = lazy(() => import('./pages/app/TempleteriaWizard').then(m => ({ default: m.TempleteriaWizard })));
const TempleteriaRefiner = lazy(() => import('./pages/app/TempleteriaRefiner').then(m => ({ default: m.TempleteriaRefiner })));

const FiscalAgenda = lazy(() => import('./pages/app/FiscalAgenda').then(m => ({ default: m.FiscalAgenda })));
const AccountChecklist = lazy(() => import('./pages/app/AccountChecklist').then(m => ({ default: m.AccountChecklist })));
const NfSolicitator = lazy(() => import('./pages/app/NfSolicitator').then(m => ({ default: m.NfSolicitator })));
const FiscalOperatorQueue = lazy(() => import('./pages/app/FiscalOperatorQueue').then(m => ({ default: m.FiscalOperatorQueue })));
const CompanyFinance = lazy(() => import('./pages/app/CompanyFinance').then(m => ({ default: m.CompanyFinance })));
const OperatorFinanceEditor = lazy(() => import('./pages/app/OperatorFinanceEditor').then(m => ({ default: m.OperatorFinanceEditor })));
const AdminFinanceBI = lazy(() => import('./pages/app/AdminFinanceBI').then(m => ({ default: m.AdminFinanceBI })));
const CompanyDas = lazy(() => import('./pages/app/CompanyDas').then(m => ({ default: m.CompanyDas })));
const OperatorDasManager = lazy(() => import('./pages/app/OperatorDasManager').then(m => ({ default: m.OperatorDasManager })));

const PublicSiteView = lazy(() => import('./pages/public/PublicSiteView').then(m => ({ default: m.PublicSiteView })));

const queryClient = new QueryClient();

function LoadingFallback() {
  return (
    <div className="flex h-64 items-center justify-center font-black animate-pulse text-slate-300 tracking-[0.3em] uppercase italic text-xs">
      Loading Module...
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-black animate-pulse bg-slate-50 text-slate-300 tracking-[0.5em]">
        INITIALIZING...
      </div>
    );

  return (
    <Suspense fallback={<LoadingFallback />}>
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
          <Route path="companies" element={<Companies />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="templeteria" element={<TempleteriaDashboard />} />
          <Route path="templeteria/wizard" element={<TempleteriaWizard />} />
          <Route path="refiner/:siteId" element={<TempleteriaRefiner />} />
          
          <Route path="company/agenda-fiscal" element={<FiscalAgenda />} />
          <Route path="company/checklist" element={<AccountChecklist />} />
          <Route path="company/nf-requests" element={<NfSolicitator />} />
          <Route path="company/finance" element={<CompanyFinance />} />
          <Route path="company/das" element={<CompanyDas />} />
          
          <Route path="operator/fiscal-queue" element={<FiscalOperatorQueue />} />
          <Route path="operator/finance/:accountId" element={<OperatorFinanceEditor />} />
          <Route path="operator/das/:accountId" element={<OperatorDasManager />} />
          
          <Route path="admin/finance" element={<AdminFinanceBI />} />
        </Route>

        <Route path="/s/:slug" element={<PublicSiteView />} />

        <Route path="*" element={<Navigate to="/app/overview" replace />} />
      </Routes>
    </Suspense>
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
