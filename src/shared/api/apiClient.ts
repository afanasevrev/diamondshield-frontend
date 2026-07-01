import { env } from '../../config/env';
import { HttpError } from './httpError';

type ApiTarget = 'central' | 'local';

interface RequestOptions extends RequestInit {
  target?: ApiTarget;
  auth?: boolean;
}

function getBaseUrl(target: ApiTarget): string {
  if (target === 'local') {
    return env.localApiBaseUrl;
  }

  return env.centralApiBaseUrl;
}

function getToken(): string | null {
  return localStorage.getItem('diamondshield_access_token');
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const target = options.target || 'central';
  const baseUrl = getBaseUrl(target);

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  headers.set('Accept', 'application/json');

  if (options.auth !== false) {
    const token = getToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';

  let payload: unknown = null;

  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text || null;
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof payload.message === 'string'
    ) {
      message = payload.message;
    }

    throw new HttpError(response.status, message, payload);
  }

  return payload as T;
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'GET',
    });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  },
};