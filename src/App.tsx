import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';

function RootRedirect() {
  const { isAdworks } = useAuth();
  return isAdworks ? <Navigate to="/admin/pipeline" replace /> : <Navigate to="/app" replace />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/" element={<PrivateRoute><Layout><div>Empty Slate</div></Layout></PrivateRoute>}>
        <Route index element={<RootRedirect />} />
        <Route path="admin/pipeline" element={<div>Pipeline View Placeholder</div>} />
        <Route path="admin/clients" element={<div>Companies List Placeholder</div>} />
        <Route path="admin/messages" element={<div>Messaging Placeholder</div>} />
        <Route path="app" element={<div>Client Progress Placeholder</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
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
