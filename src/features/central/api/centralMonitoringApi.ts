import { apiClient } from '../../../shared/api/apiClient';

function normalizeArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (response && typeof response === 'object') {
    const objectResponse = response as Record<string, unknown>;

    if (Array.isArray(objectResponse.items)) {
      return objectResponse.items as T[];
    }

    if (Array.isArray(objectResponse.content)) {
      return objectResponse.content as T[];
    }

    if (Array.isArray(objectResponse.data)) {
      return objectResponse.data as T[];
    }
  }

  return [];
}

export interface CentralAlarmEvent {
  id: string;
  localEventId?: string | null;
  objectId?: string | null;
  localServerId?: string | null;
  controllerId?: string | null;
  accessPointId?: string | null;
  alarmType?: string | null;
  severity?: string | null;
  message?: string | null;
  status?: string | null;
  eventTime?: string | null;
  receivedAt?: string | null;
  createdAt?: string | null;
}

export interface AuditEvent {
  id: string;
  userId?: string | null;
  username?: string | null;
  action?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  message?: string | null;
  createdAt?: string | null;
}

export interface SyncHistoryItem {
  id: string;
  localServerId?: string | null;
  objectId?: string | null;
  operation?: string | null;
  status?: string | null;
  message?: string | null;
  itemsReceived?: number | null;
  itemsSent?: number | null;
  accessEvents?: number | null;
  alarmEvents?: number | null;
  deviceStatuses?: number | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt?: string | null;
}

export interface LocalSyncConfigResponse {
  localServerId?: string;
  objectId?: string | null;

  controllers?: unknown[];
  readers?: unknown[];
  accessPoints?: unknown[];
  persons?: unknown[];
  identifiers?: unknown[];
  accessRules?: unknown[];
  schedules?: unknown[];
  scheduleIntervals?: unknown[];
}

export interface HeartbeatRequest {
  ipAddress: string;
  softwareVersion: string;
  status: string;
  message: string;
}

export interface HeartbeatResponse {
  status?: string;
  message?: string;
  localServerId?: string;
  objectId?: string;
  serverTime?: string;
}

export async function getCentralAlarmEvents(): Promise<CentralAlarmEvent[]> {
  const response = await apiClient.get<unknown>('/api/alarm-events');
  return normalizeArray<CentralAlarmEvent>(response);
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  const response = await apiClient.get<unknown>('/api/audit-events');
  return normalizeArray<AuditEvent>(response);
}

export async function getSyncHistory(): Promise<SyncHistoryItem[]> {
  const response = await apiClient.get<unknown>('/api/sync-history');
  return normalizeArray<SyncHistoryItem>(response);
}

export function getLocalSyncConfig(
  localServerId: string,
  localServerToken: string,
): Promise<LocalSyncConfigResponse> {
  return apiClient.get<LocalSyncConfigResponse>('/api/local-sync/config', {
    auth: false,
    headers: {
      'X-Local-Server-Id': localServerId,
      'X-Local-Server-Token': localServerToken,
    },
  });
}

export function sendLocalServerHeartbeat(
  localServerId: string,
  localServerToken: string,
  request: HeartbeatRequest,
): Promise<HeartbeatResponse> {
  return apiClient.post<HeartbeatResponse>(
    '/api/local-sync/heartbeat',
    request,
    {
      auth: false,
      headers: {
        'X-Local-Server-Id': localServerId,
        'X-Local-Server-Token': localServerToken,
      },
    },
  );
}