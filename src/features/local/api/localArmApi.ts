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

export interface LocalAccessEvent {
  id: string;
  localEventId?: string;
  eventTime?: string;
  createdAt?: string;

  accessResult?: string;
  eventResult?: string;

  reason?: string | null;
  denyReason?: string | null;

  personId?: string | null;
  personFullName?: string | null;

  identifierId?: string | null;
  identifierMasked?: string | null;

  unknownIdentifier?: string | null;
  unknownIdentifierHash?: string | null;
  isUnknownIdentifier?: boolean;

  readerId?: string | null;
  controllerId?: string | null;
  accessPointId?: string | null;

  direction?: string | null;

  sentToCentral?: boolean;
  isSynced?: boolean;
  syncedAt?: string | null;
}

export interface LocalAlarmEvent {
  id: string;
  localEventId?: string;
  alarmType?: string;
  severity?: string;
  message?: string;
  description?: string;
  accessPointId?: string | null;
  controllerId?: string | null;
  status?: string;
  sentToCentral?: boolean;
  isSynced?: boolean;
  createdAt?: string;
}

export interface LocalDeviceStatusEvent {
  id: string;
  deviceType?: string;
  deviceId?: string;
  status?: string;
  message?: string;
  sentToCentral?: boolean;
  isSynced?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocalController {
  id: string;
  centralControllerId?: string;
  name: string;
  model?: string;
  serialNumber?: string;
  ipAddress?: string;
  port?: number;
  status?: string;
  lastSeenAt?: string;
}

export interface LocalReader {
  id: string;
  centralReaderId?: string;
  controllerId?: string;
  localControllerId?: string;
  accessPointId?: string;
  name: string;
  readerType?: string;
  direction?: string;
  status?: string;
  percoExdevNumber?: number | null;
  percoDirection?: number | null;
}

export interface LocalAccessPoint {
  id: string;
  centralAccessPointId?: string;
  controllerId?: string;
  localControllerId?: string;
  name: string;
  accessPointType?: string;
  status?: string;
  active?: boolean;
  isActive?: boolean;
}

export interface LocalPerson {
  id: string;
  centralPersonId?: string;
  personType?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;
  active?: boolean;
  isActive?: boolean;
}

export async function getLocalAccessEvents(): Promise<LocalAccessEvent[]> {
  const response = await apiClient.get<unknown>('/api/local/access-events', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalAccessEvent>(response);
}

export async function getLocalUnknownAccessEvents(): Promise<LocalAccessEvent[]> {
  const response = await apiClient.get<unknown>(
    '/api/local/access-events?unknown=true',
    {
      target: 'local',
      auth: false,
    },
  );

  return normalizeArray<LocalAccessEvent>(response);
}

export async function getLocalAlarmEvents(): Promise<LocalAlarmEvent[]> {
  const response = await apiClient.get<unknown>('/api/local/alarm-events', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalAlarmEvent>(response);
}

export async function getLocalDeviceStatusEvents(): Promise<
  LocalDeviceStatusEvent[]
> {
  const response = await apiClient.get<unknown>(
    '/api/local/device-status-events',
    {
      target: 'local',
      auth: false,
    },
  );

  return normalizeArray<LocalDeviceStatusEvent>(response);
}

export async function getLocalControllers(): Promise<LocalController[]> {
  const response = await apiClient.get<unknown>('/api/local/controllers', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalController>(response);
}

export async function getLocalReaders(): Promise<LocalReader[]> {
  const response = await apiClient.get<unknown>('/api/local/readers', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalReader>(response);
}

export async function getLocalAccessPoints(): Promise<LocalAccessPoint[]> {
  const response = await apiClient.get<unknown>('/api/local/access-points', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalAccessPoint>(response);
}

export async function getLocalPersons(): Promise<LocalPerson[]> {
  const response = await apiClient.get<unknown>('/api/local/persons', {
    target: 'local',
    auth: false,
  });

  return normalizeArray<LocalPerson>(response);
}