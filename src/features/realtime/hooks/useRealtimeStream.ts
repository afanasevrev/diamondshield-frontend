import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  type RealtimeEnvelope,
  type RealtimeEventType,
} from '../api/realtimeTypes';

interface UseRealtimeStreamOptions {
  enabled?: boolean;
  showToasts?: boolean;
  maxItems?: number;
}

interface RealtimeState {
  connected: boolean;
  connecting: boolean;
  lastError: string | null;
  events: RealtimeEnvelope[];
}

function getCentralBaseUrl() {
  return import.meta.env.VITE_CENTRAL_API_URL || 'http://localhost:8080';
}

function normalizeType(type: string): RealtimeEventType {
  if (
    type === 'access-event' ||
    type === 'alarm-event' ||
    type === 'device-status' ||
    type === 'local-server-status' ||
    type === 'guest-event' ||
    type === 'perco-event' ||
    type === 'heartbeat'
  ) {
    return type;
  }

  return 'unknown';
}

export function useRealtimeStream(options: UseRealtimeStreamOptions = {}) {
  const { enabled = true, showToasts = true, maxItems = 100 } = options;

  const auth = useAuth();
  const toast = useToast();

  const [state, setState] = useState<RealtimeState>({
    connected: false,
    connecting: false,
    lastError: null,
    events: [],
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  const streamUrl = useMemo(() => {
    const baseUrl = getCentralBaseUrl();
    const token = auth.token || '';

    const url = new URL('/api/realtime/stream', baseUrl);

    if (token) {
      url.searchParams.set('token', token);
    }

    return url.toString();
  }, [auth.token]);

  function pushEvent(type: RealtimeEventType, payload: unknown) {
    const envelope: RealtimeEnvelope = {
      id: crypto.randomUUID(),
      type,
      receivedAt: new Date().toISOString(),
      payload,
    };

    setState((prev) => ({
      ...prev,
      events: [envelope, ...prev.events].slice(0, maxItems),
    }));

    if (!showToasts) {
      return;
    }

    if (type === 'access-event') {
      toast.showToast({
        tone: 'info',
        title: 'Событие прохода',
        message: JSON.stringify(payload),
      });
    }

    if (type === 'alarm-event') {
      toast.showToast({
        tone: 'danger',
        title: 'Тревога',
        message: JSON.stringify(payload),
      });
    }

    if (type === 'local-server-status') {
      toast.showToast({
        tone: 'warning',
        title: 'Статус локального сервера',
        message: JSON.stringify(payload),
      });
    }

    if (type === 'guest-event') {
      toast.showToast({
        tone: 'info',
        title: 'Гостевое событие',
        message: JSON.stringify(payload),
      });
    }
  }

  function connect() {
    if (!enabled || !auth.token) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      connecting: true,
      lastError: null,
    }));

    const source = new EventSource(streamUrl);

    eventSourceRef.current = source;

    source.onopen = () => {
      setState((prev) => ({
        ...prev,
        connected: true,
        connecting: false,
        lastError: null,
      }));
    };

    source.onerror = () => {
      setState((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        lastError: 'Realtime stream disconnected',
      }));

      source.close();

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = window.setTimeout(() => {
        connect();
      }, 5000);
    };

    const eventTypes: RealtimeEventType[] = [
      'access-event',
      'alarm-event',
      'device-status',
      'local-server-status',
      'guest-event',
      'perco-event',
      'heartbeat',
    ];

    for (const type of eventTypes) {
      source.addEventListener(type, (event) => {
        try {
          const messageEvent = event as MessageEvent;
          const payload = JSON.parse(messageEvent.data);

          pushEvent(type, payload);
        } catch {
          pushEvent(type, {
            raw: (event as MessageEvent).data,
          });
        }
      });
    }

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const type = normalizeType(parsed.type || 'unknown');

        pushEvent(type, parsed.payload || parsed);
      } catch {
        pushEvent('unknown', {
          raw: event.data,
        });
      }
    };
  }

  function disconnect() {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      connected: false,
      connecting: false,
    }));
  }

  function clearEvents() {
    setState((prev) => ({
      ...prev,
      events: [],
    }));
  }

  useEffect(() => {
    if (enabled && auth.token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, auth.token, streamUrl]);

  return {
    ...state,
    connect,
    disconnect,
    clearEvents,
  };
}