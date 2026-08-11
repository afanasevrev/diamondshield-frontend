import { apiClient } from '../../../shared/api/apiClient';
import { appConfig } from '../../../shared/config/appConfig';

export interface HealthResponse {
  status?: string;
  service?: string;
  version?: string;
  time?: string;
  database?: string;
  message?: string;
}

export interface HealthCheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  message: string;
  response?: unknown;
}

async function checkUrl(name: string, url: string): Promise<HealthCheckResult> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }

    return {
      name,
      url,
      ok: response.ok,
      status: response.status,
      message: response.ok ? 'OK' : `HTTP ${response.status}`,
      response: payload,
    };
  } catch (ex) {
    return {
      name,
      url,
      ok: false,
      message: ex instanceof Error ? ex.message : 'Connection error',
    };
  }
}

export function getCentralHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/api/health', {
    target: 'central',
    auth: false,
  });
}

export function getLocalHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/api/local/health', {
    target: 'local',
    auth: false,
  });
}

export async function runHealthChecks(): Promise<HealthCheckResult[]> {
  const centralBase = appConfig.centralApiUrl;
  const localBase = appConfig.localApiUrl;

  const checks = [
    checkUrl('Central health', `${centralBase}/api/health`),
    checkUrl('Central auth/me', `${centralBase}/api/auth/me`),
    checkUrl('Local health', `${localBase}/api/local/health`),
    checkUrl('Local diagnostics', `${localBase}/api/local/diagnostics`),
  ];

  return Promise.all(checks);
}