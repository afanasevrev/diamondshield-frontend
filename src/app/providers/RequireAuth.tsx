import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ErrorMessage } from '../../components/feedback/ErrorMessage';
import { Loading } from '../../components/feedback/Loading';
import { useAuth } from './AuthProvider';

interface RequireAuthProps {
  children: ReactNode;
  permissions?: string[];
}

export function RequireAuth({ children, permissions = [] }: RequireAuthProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        to="/central/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (auth.loadingProfile) {
    return <Loading />;
  }

  if (permissions.length > 0 && !auth.hasAnyPermission(permissions)) {
    return (
      <div className="ds-page">
        <ErrorMessage message="403 Forbidden. У пользователя нет прав на этот раздел." />
      </div>
    );
  }

  return <>{children}</>;
}