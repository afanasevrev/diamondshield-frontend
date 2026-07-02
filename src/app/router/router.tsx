import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { LoginPage } from '../../features/auth/LoginPage';
import { CentralDashboardPage } from '../../features/central/dashboard/CentralDashboardPage';
import { LocalDiagnosticsPage } from '../../features/local/diagnostics/LocalDiagnosticsPage';
import { LocalOperatorDashboardPage } from '../../features/local/operator/LocalOperatorDashboardPage';
import { NotFoundPage } from '../../features/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/central/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/central/dashboard',
        element: <CentralDashboardPage />,
      },
      {
        path: '/local/operator',
        element: <LocalOperatorDashboardPage />,
      },
      {
        path: '/local/diagnostics',
        element: <LocalDiagnosticsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);