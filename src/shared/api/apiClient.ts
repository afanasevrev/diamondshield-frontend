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

  const isFormData = options.body instanceof FormData;

  if (!headers.has('Content-Type') && !isFormData && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

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

    if (response.status === 401) {
      message = '401 Unauthorized. Выполни вход заново или проверь JWT.';
    }

    if (response.status === 403) {
      message = '403 Forbidden. У пользователя нет нужного права.';
    }

    throw new HttpError(response.status, message, payload);
  }

  return payload as T;
}

function buildBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
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
      body: buildBody(body),
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
      body: buildBody(body),
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  },
};