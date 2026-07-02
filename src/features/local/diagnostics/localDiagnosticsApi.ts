import { apiClient } from '../../../shared/api/apiClient';

export interface LocalDiagnosticsStatus {
  application?: string;
  status?: string;
  serverTime?: string;

  localServerId?: string;
  centralBaseUrl?: string;

  objectId?: string | null;
  lastConfigPullAt?: string | null;
  lastSuccessfulPushAt?: string | null;

  controllers?: number;
  readers?: number;
  accessPoints?: number;

  persons?: number;
  identifiers?: number;
  accessRules?: number;

  schedules?: number;
  scheduleIntervals?: number;

  accessEvents?: number;
  sentAccessEvents?: number;
  unsentAccessEvents?: number;

  alarmEvents?: number;
  sentAlarmEvents?: number;
  unsentAlarmEvents?: number;

  deviceStatusEvents?: number;
  sentDeviceStatusEvents?: number;
  unsentDeviceStatusEvents?: number;

  percoEnabled?: boolean;
  percoWebsocketPath?: string;
  percoDefaultOpenTimeMs?: number;
  percoDefaultOpenType?: string;
  percoIdentifierType?: string;
}

export function getLocalDiagnosticsStatus() {
  return apiClient.get<LocalDiagnosticsStatus>(
    '/api/local/diagnostics/status',
    {
      target: 'local',
      auth: false,
    },
  );
}

export interface PushEventsResponse {
  status: string;
  operation: string;
  accessEvents: number;
  alarmEvents: number;
  deviceStatuses: number;
  total: number;
}

export function pushLocalEvents() {
  return apiClient.post<PushEventsResponse>(
    '/api/local/sync/push-events',
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export interface PullConfigResponse {
  status?: string;
  operation?: string;
  message?: string;
}

export function pullLocalConfig() {
  return apiClient.post<PullConfigResponse>(
    '/api/local/sync/pull-config',
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}