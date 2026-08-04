import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CentralLoginPage } from '../features/auth/CentralLoginPage';

import { CentralDashboardPage } from '../features/central/dashboard/CentralDashboardPage';
import { OrganizationsPage } from '../features/central/organizations/OrganizationsPage';
import { ObjectsPage } from '../features/central/objects/ObjectsPage';
import { LocalServersPage } from '../features/central/local-servers/LocalServersPage';
import { ControllersPage } from '../features/central/controllers/ControllersPage';
import { ReadersPage } from '../features/central/readers/ReadersPage';
import { AccessPointsPage } from '../features/central/access-points/AccessPointsPage';
import { PersonsPage } from '../features/central/persons/PersonsPage';
import { IdentifiersPage } from '../features/central/identifiers/IdentifiersPage';
import { SchedulesPage } from '../features/central/schedules/SchedulesPage';
import { AccessRulesPage } from '../features/central/access-rules/AccessRulesPage';
import { AccessCheckPage } from '../features/central/access-check/AccessCheckPage';
import { AccessEventsPage } from '../features/central/access-events/AccessEventsPage';

import { CentralAlarmsPage } from '../features/central/alarms/CentralAlarmsPage';
import { CentralAuditPage } from '../features/central/audit/CentralAuditPage';
import { SyncHistoryPage } from '../features/central/sync-history/SyncHistoryPage';
import { LocalSyncConfigPage } from '../features/central/local-sync-config/LocalSyncConfigPage';
import { HeartbeatDebugPage } from '../features/central/heartbeat-debug/HeartbeatDebugPage';
import { OfflineDiagnosticsPage } from '../features/central/offline-diagnostics/OfflineDiagnosticsPage';

import { PersonsImportPage } from '../features/central/imports/PersonsImportPage';
import { PersonCardPage } from '../features/central/person-card/PersonCardPage';
import { CardBindingPage } from '../features/central/card-binding/CardBindingPage';

import { PublicGuestRequestPage } from '../features/guests/public/PublicGuestRequestPage';
import { GuestRequestsPage } from '../features/guests/central/GuestRequestsPage';
import { GuestsRegistryPage } from '../features/guests/central/GuestsRegistryPage';
import { GuestBlacklistPage } from '../features/guests/central/GuestBlacklistPage';
import { LocalGuestDeskPage } from '../features/guests/local/LocalGuestDeskPage';

import { LocalDiagnosticsPage } from '../features/local/diagnostics/LocalDiagnosticsPage';
import { LocalOperatorDashboardPage } from '../features/local/operator/LocalOperatorDashboardPage';
import { LocalPercoPage } from '../features/local/perco/LocalPercoPage';
import { LocalAccessEventsPage } from '../features/local/access-events/LocalAccessEventsPage';
import { LocalAlarmsPage } from '../features/local/alarms/LocalAlarmsPage';
import { LocalPhotoLinePage } from '../features/local/photo-line/LocalPhotoLinePage';
import { LocalDeviceStatusPage } from '../features/local/device-status/LocalDeviceStatusPage';
import { LocalAccessPointsPage } from '../features/local/access-points/LocalAccessPointsPage';
import { LocalControllersPage } from '../features/local/controllers/LocalControllersPage';
import { LocalManualControlPage } from '../features/local/manual-control/LocalManualControlPage';

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
    path: '/public/guest-request',
    element: <PublicGuestRequestPage />,
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
        path: '/central/local-servers',
        element: <LocalServersPage />,
      },
      {
        path: '/central/offline-diagnostics',
        element: <OfflineDiagnosticsPage />,
      },
      {
        path: '/central/heartbeat-debug',
        element: <HeartbeatDebugPage />,
      },
      {
        path: '/central/local-sync-config',
        element: <LocalSyncConfigPage />,
      },
      {
        path: '/central/controllers',
        element: <ControllersPage />,
      },
      {
        path: '/central/readers',
        element: <ReadersPage />,
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
        path: '/central/person-card',
        element: <PersonCardPage />,
      },
      {
        path: '/central/identifiers',
        element: <IdentifiersPage />,
      },
      {
        path: '/central/card-binding',
        element: <CardBindingPage />,
      },
      {
        path: '/central/imports',
        element: <PersonsImportPage />,
      },
      {
        path: '/central/guest-requests',
        element: <GuestRequestsPage />,
      },
      {
        path: '/central/guests',
        element: <GuestsRegistryPage />,
      },
      {
        path: '/central/guest-blacklist',
        element: <GuestBlacklistPage />,
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
        path: '/central/alarms',
        element: <CentralAlarmsPage />,
      },
      {
        path: '/central/sync-history',
        element: <SyncHistoryPage />,
      },
      {
        path: '/central/audit',
        element: <CentralAuditPage />,
      },

      {
        path: '/local/operator',
        element: <LocalOperatorDashboardPage />,
      },
      {
        path: '/local/guest-desk',
        element: <LocalGuestDeskPage />,
      },
      {
        path: '/local/photo-line',
        element: <LocalPhotoLinePage />,
      },
      {
        path: '/local/access-events',
        element: <LocalAccessEventsPage />,
      },
      {
        path: '/local/alarms',
        element: <LocalAlarmsPage />,
      },
      {
        path: '/local/device-status',
        element: <LocalDeviceStatusPage />,
      },
      {
        path: '/local/manual-control',
        element: <LocalManualControlPage />,
      },
      {
        path: '/local/access-points',
        element: <LocalAccessPointsPage />,
      },
      {
        path: '/local/controllers',
        element: <LocalControllersPage />,
      },
      {
        path: '/local/perco',
        element: <LocalPercoPage />,
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