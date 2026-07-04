import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CentralLoginPage } from '../features/auth/CentralLoginPage';
import { CentralDashboardPage } from '../features/central/dashboard/CentralDashboardPage';
import { OrganizationsPage } from '../features/central/organizations/OrganizationsPage';
import { ObjectsPage } from '../features/central/objects/ObjectsPage';
import { AccessPointsPage } from '../features/central/access-points/AccessPointsPage';
import { PersonsPage } from '../features/central/persons/PersonsPage';
import { IdentifiersPage } from '../features/central/identifiers/IdentifiersPage';
import { SchedulesPage } from '../features/central/schedules/SchedulesPage';
import { AccessRulesPage } from '../features/central/access-rules/AccessRulesPage';
import { AccessCheckPage } from '../features/central/access-check/AccessCheckPage';
import { AccessEventsPage } from '../features/central/access-events/AccessEventsPage';
import { LocalDiagnosticsPage } from '../features/local/diagnostics/LocalDiagnosticsPage';
import { LocalOperatorDashboardPage } from '../features/local/operator/LocalOperatorDashboardPage';
import { NotFoundPage } from '../features/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/central/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Navigate to="/central/login" replace />,
  },
  {
    path: '/central/login',
    element: <CentralLoginPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/central/dashboard',
        element: <CentralDashboardPage />,
      },
      {
        path: '/central/organizations',
        element: <OrganizationsPage />,
      },
      {
        path: '/central/objects',
        element: <ObjectsPage />,
      },
      {
        path: '/central/access-points',
        element: <AccessPointsPage />,
      },
      {
        path: '/central/persons',
        element: <PersonsPage />,
      },
      {
        path: '/central/identifiers',
        element: <IdentifiersPage />,
      },
      {
        path: '/central/schedules',
        element: <SchedulesPage />,
      },
      {
        path: '/central/access-rules',
        element: <AccessRulesPage />,
      },
      {
        path: '/central/access-check',
        element: <AccessCheckPage />,
      },
      {
        path: '/central/access-events',
        element: <AccessEventsPage />,
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