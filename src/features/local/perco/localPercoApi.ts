import { apiClient } from '../../../shared/api/apiClient';

export interface PercoSession {
  sessionId: string;
  open: boolean;
  remoteAddress?: string | null;
  controllerId?: string | null;
}

export interface PercoSessionsResponse {
  openSessions: number;
  sessions: PercoSession[];
}

export interface PercoCommandResponse {
  status?: string;
  message?: string;
  controllerId?: string;
  command?: string;
}

export function getPercoSessions() {
  return apiClient.get<PercoSessionsResponse>('/api/local/perco/sessions', {
    target: 'local',
    auth: false,
  });
}

export function requestPercoState(controllerId: string) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/state`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function requestPercoNet(controllerId: string) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/net`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function requestPercoReader(controllerId: string, number: number) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/reader?number=${number}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function requestPercoExdev(controllerId: string, number: number) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/exdev?number=${number}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function openPercoExdev(
  controllerId: string,
  number: number,
  direction: number,
) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/open?number=${number}&direction=${direction}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function closePercoExdev(
  controllerId: string,
  number: number,
  direction: number,
) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/close?number=${number}&direction=${direction}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function banPercoAccess(
  controllerId: string,
  number: number,
  direction: number,
) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/ban?number=${number}&direction=${direction}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}

export function setPercoAccessMode(
  controllerId: string,
  number: number,
  direction: number,
  accessMode: 'open' | 'control',
) {
  return apiClient.post<PercoCommandResponse>(
    `/api/local/perco/${controllerId}/access-mode?number=${number}&direction=${direction}&accessMode=${accessMode}`,
    undefined,
    {
      target: 'local',
      auth: false,
    },
  );
}