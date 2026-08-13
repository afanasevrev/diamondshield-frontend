import { type ReactElement } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CentralLoginPage } from '../features/auth/CentralLoginPage';
import { RequireAuth } from './providers/RequireAuth';

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

import { UsersPage } from '../features/admin/users/UsersPage';
import { RolesPage } from '../features/admin/roles/RolesPage';
import { PermissionsPage } from '../features/admin/permissions/PermissionsPage';

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
import { RealtimeDashboardPage } from '../features/realtime/pages/RealtimeDashboardPage';
import { LiveAccessEventsPage } from '../features/realtime/pages/LiveAccessEventsPage';
import { LiveAlarmsPage } from '../features/realtime/pages/LiveAlarmsPage';
import { LiveDeviceStatusPage } from '../features/realtime/pages/LiveDeviceStatusPage';
import { LiveGuestDeskPage } from '../features/realtime/pages/LiveGuestDeskPage';

import { NotFoundPage } from '../features/NotFoundPage';

import { SettingsPage } from '../features/admin/settings/SettingsPage';
import { HealthPage } from '../features/admin/health/HealthPage';
import { EnvPage } from '../features/admin/env/EnvPage';
import { DemoChecklistPage } from '../features/admin/demo/DemoChecklistPage';

function protectedPage(element: ReactElement, permissions: string[] = []) {
  return <RequireAuth permissions={permissions}>{element}</RequireAuth>;
}

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
    element: protectedPage(<AppShell />),
    children: [
      {
        path: '/central/dashboard',
        element: <CentralDashboardPage />,
      },
      {
        path: '/central/organizations',
        element: protectedPage(<OrganizationsPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/objects',
        element: protectedPage(<ObjectsPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/local-servers',
        element: protectedPage(<LocalServersPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/offline-diagnostics',
        element: protectedPage(<OfflineDiagnosticsPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/heartbeat-debug',
        element: protectedPage(<HeartbeatDebugPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/local-sync-config',
        element: protectedPage(<LocalSyncConfigPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/controllers',
        element: protectedPage(<ControllersPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/readers',
        element: protectedPage(<ReadersPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/access-points',
        element: protectedPage(<AccessPointsPage />, ['ORGANIZATION_VIEW']),
      },
      {
        path: '/central/persons',
        element: protectedPage(<PersonsPage />, ['PERSON_VIEW']),
      },
      {
        path: '/central/person-card',
        element: protectedPage(<PersonCardPage />, ['PERSON_VIEW']),
      },
      {
        path: '/central/identifiers',
        element: protectedPage(<IdentifiersPage />, ['IDENTIFIER_VIEW']),
      },
      {
        path: '/central/card-binding',
        element: protectedPage(<CardBindingPage />, ['IDENTIFIER_MANAGE']),
      },
      {
        path: '/central/imports',
        element: protectedPage(<PersonsImportPage />, ['PERSON_IMPORT']),
      },
      {
        path: '/central/guest-requests',
        element: protectedPage(<GuestRequestsPage />, ['GUEST_REQUEST_READ']),
      },
      {
        path: '/central/guests',
        element: protectedPage(<GuestsRegistryPage />, ['GUEST_VIEW']),
      },
      {
        path: '/central/guest-blacklist',
        element: protectedPage(<GuestBlacklistPage />, ['GUEST_BLACKLIST_VIEW']),
      },
      {
        path: '/central/schedules',
        element: protectedPage(<SchedulesPage />, ['SCHEDULE_VIEW']),
      },
      {
        path: '/central/access-rules',
        element: protectedPage(<AccessRulesPage />, ['ACCESS_RULE_VIEW']),
      },
      {
        path: '/central/access-check',
        element: protectedPage(<AccessCheckPage />, ['ACCESS_CHECK']),
      },
      {
        path: '/central/access-events',
        element: protectedPage(<AccessEventsPage />, ['ACCESS_EVENT_VIEW']),
      },
      {
        path: '/central/alarms',
        element: protectedPage(<CentralAlarmsPage />, ['ALARM_EVENT_VIEW']),
      },
      {
        path: '/central/sync-history',
        element: protectedPage(<SyncHistoryPage />, ['SYNC_VIEW']),
      },
      {
        path: '/central/audit',
        element: protectedPage(<CentralAuditPage />, ['AUDIT_VIEW']),
      },
      {
        path: '/central/realtime',
        element: protectedPage(<RealtimeDashboardPage />, ['REALTIME_VIEW']),
      },
      {
        path: '/central/live-access-events',
        element: protectedPage(<LiveAccessEventsPage />, ['REALTIME_VIEW']),
      },
      {
        path: '/central/live-alarms',
        element: protectedPage(<LiveAlarmsPage />, ['REALTIME_VIEW']),
      },
      {
        path: '/central/live-device-status',
        element: protectedPage(<LiveDeviceStatusPage />, ['REALTIME_VIEW']),
      },
      {
        path: '/central/live-guests',
        element: protectedPage(<LiveGuestDeskPage />, ['REALTIME_VIEW']),
      },
      {
        path: '/admin/users',
        element: protectedPage(<UsersPage />, ['USER_VIEW']),
      },
      {
        path: '/admin/roles',
        element: protectedPage(<RolesPage />, ['ROLE_VIEW']),
      },
      {
        path: '/admin/permissions',
        element: protectedPage(<PermissionsPage />, ['PERMISSION_VIEW']),
      },
      {
        path: '/admin/settings',
        element: protectedPage(<SettingsPage />, ['ADMIN_SETTINGS']),
      },
      {
        path: '/admin/health',
        element: protectedPage(<HealthPage />, ['ADMIN_SETTINGS']),
      },
      {
        path: '/admin/env',
        element: protectedPage(<EnvPage />, ['ADMIN_SETTINGS']),
      },
      {
        path: '/admin/demo-checklist',
        element: protectedPage(<DemoChecklistPage />, ['ADMIN_SETTINGS']),
      },
      {
        path: '/local/operator',
        element: <LocalOperatorDashboardPage />,
      },
      {
        path: '/local/guest-desk',
        element: protectedPage(<LocalGuestDeskPage />, ['GUEST_VIEW']),
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