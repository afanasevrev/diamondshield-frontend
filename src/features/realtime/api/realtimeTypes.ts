export type RealtimeEventType =
  | 'access-event'
  | 'alarm-event'
  | 'device-status'
  | 'local-server-status'
  | 'guest-event'
  | 'perco-event'
  | 'heartbeat'
  | 'unknown';

export interface RealtimeEnvelope<TPayload = unknown> {
  id: string;
  type: RealtimeEventType;
  receivedAt: string;
  payload: TPayload;
}

export interface RealtimeAccessEvent {
  id?: string;
  eventTime?: string;
  personFullName?: string;
  personId?: string;
  identifierMasked?: string;
  unknownIdentifier?: string;
  accessPointId?: string;
  controllerId?: string;
  accessResult?: string;
  reason?: string;
  direction?: string;
}

export interface RealtimeAlarmEvent {
  id?: string;
  createdAt?: string;
  alarmType?: string;
  severity?: string;
  message?: string;
  accessPointId?: string;
  controllerId?: string;
}

export interface RealtimeDeviceStatusEvent {
  id?: string;
  createdAt?: string;
  deviceType?: string;
  deviceId?: string;
  status?: string;
  message?: string;
}

export interface RealtimeLocalServerStatus {
  localServerId?: string;
  objectId?: string;
  status?: string;
  lastSeenAt?: string;
  message?: string;
}

export interface RealtimeGuestEvent {
  id?: string;
  guestId?: string;
  guestFullName?: string;
  action?: string;
  status?: string;
  eventTime?: string;
  message?: string;
}

export interface RealtimePercoEvent {
  controllerId?: string;
  event?: string;
  number?: number;
  direction?: number;
  raw?: unknown;
}