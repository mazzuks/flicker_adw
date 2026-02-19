import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

interface PrivateRouteProps {
  children: ReactNode;
  requireAdworks?: boolean;
}

export function PrivateRoute({ children, requireAdworks = false }: PrivateRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    requireAdworks &&
    profile &&
    !profile.role_global.startsWith('ADWORKS_') &&
    !profile.role_global.startsWith('OPERATOR_')
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
