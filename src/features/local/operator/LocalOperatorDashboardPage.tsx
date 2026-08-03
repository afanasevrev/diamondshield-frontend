import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/badges/Badge';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { getLocalDiagnosticsStatus } from '../diagnostics/localDiagnosticsApi';
import {
  getLocalAccessEvents,
  getLocalAlarmEvents,
  type LocalAccessEvent,
  type LocalAlarmEvent,
} from '../api/localArmApi';
import { getPercoSessions } from '../perco/localPercoApi';

interface DashboardState {
  diagnostics: Awaited<ReturnType<typeof getLocalDiagnosticsStatus>> | null;
  accessEvents: LocalAccessEvent[];
  alarms: LocalAlarmEvent[];
  percoOpenSessions: number;
}

export function LocalOperatorDashboardPage() {
  const [state, setState] = useState<DashboardState>({
    diagnostics: null,
    accessEvents: [],
    alarms: [],
    percoOpenSessions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [diagnostics, accessEvents, alarms, percoSessions] =
        await Promise.allSettled([
          getLocalDiagnosticsStatus(),
          getLocalAccessEvents(),
          getLocalAlarmEvents(),
          getPercoSessions(),
        ]);

      setState({
        diagnostics:
          diagnostics.status === 'fulfilled' ? diagnostics.value : null,
        accessEvents:
          accessEvents.status === 'fulfilled'
            ? accessEvents.value.slice(0, 8)
            : [],
        alarms:
          alarms.status === 'fulfilled' ? alarms.value.slice(0, 8) : [],
        percoOpenSessions:
          percoSessions.status === 'fulfilled'
            ? percoSessions.value.openSessions
            : 0,
      });
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка загрузки панели оператора',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(load, 5000);

    return () => window.clearInterval(timer);
  }, [autoRefresh]);

  const diagnostics = state.diagnostics;

  return (
    <div className="ds-page">
      <PageHeader
        title="АРМ оператора объекта"
        description="Оперативный мониторинг проходов, тревог и оборудования"
        actions={
          <>
            <Button variant="secondary" onClick={load}>
              Обновить
            </Button>

            <Button
              variant={autoRefresh ? 'primary' : 'secondary'}
              onClick={() => setAutoRefresh((value) => !value)}
            >
              Auto refresh: {autoRefresh ? 'on' : 'off'}
            </Button>

            <Link to="/local/manual-control">
              <Button>Ручное управление</Button>
            </Link>
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      {loading && <Loading />}

      <div className="ds-grid ds-grid-3">
        <Card title="Локальный сервер" subtitle="Состояние объекта">
          <div style={{ display: 'grid', gap: 10 }}>
            <StatusDot status={diagnostics?.status || 'unknown'} />
            <Info label="Время сервера" value={formatDateTime(diagnostics?.serverTime)} />
            <Info label="Object ID" value={diagnostics?.objectId || '—'} />
          </div>
        </Card>

        <Card title="PERCo C01" subtitle="WebSocket-сессии">
          <div style={{ display: 'grid', gap: 10 }}>
            <StatusDot
              status={state.percoOpenSessions > 0 ? 'online' : 'offline'}
              label={`Подключений: ${state.percoOpenSessions}`}
            />

            <Link to="/local/perco">
              <Button variant="secondary" size="sm">
                Открыть PERCo
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Очереди синхронизации" subtitle="События к отправке">
          <div style={{ display: 'grid', gap: 10 }}>
            <Info
              label="Проходы"
              value={String(diagnostics?.unsentAccessEvents ?? 0)}
            />
            <Info
              label="Тревоги"
              value={String(diagnostics?.unsentAlarmEvents ?? 0)}
            />
            <Info
              label="Статусы"
              value={String(diagnostics?.unsentDeviceStatusEvents ?? 0)}
            />
          </div>
        </Card>
      </div>

      <div className="ds-grid ds-grid-2">
        <Card
          title="Последние проходы"
          subtitle="Фоторяд и события доступа"
          actions={
            <Link to="/local/access-events">
              <Button variant="secondary" size="sm">
                Журнал
              </Button>
            </Link>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {state.accessEvents.length === 0 && (
              <div style={{ color: 'var(--ds-text-muted)' }}>
                Нет событий прохода
              </div>
            )}

            {state.accessEvents.map((item) => {
              const result = item.accessResult || item.eventResult || '—';

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px minmax(0, 1fr) auto',
                    gap: 12,
                    alignItems: 'center',
                    padding: 10,
                    border: '1px solid var(--ds-border)',
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'var(--ds-primary-soft)',
                    }}
                  >
                    {item.unknownIdentifier ? '?' : '👤'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {item.personFullName ||
                        item.personId ||
                        'Неизвестный пользователь'}
                    </div>

                    <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                      {formatDateTime(item.eventTime || item.createdAt)}
                    </div>
                  </div>

                  <Badge tone={result === 'allowed' ? 'success' : 'danger'}>
                    {result}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          title="Активные тревоги"
          subtitle="Последние тревожные события"
          actions={
            <Link to="/local/alarms">
              <Button variant="secondary" size="sm">
                Все тревоги
              </Button>
            </Link>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {state.alarms.length === 0 && (
              <div style={{ color: 'var(--ds-text-muted)' }}>
                Нет тревожных событий
              </div>
            )}

            {state.alarms.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gap: 6,
                  padding: 10,
                  border: '1px solid var(--ds-border)',
                  borderRadius: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{item.alarmType || 'alarm'}</strong>
                  <Badge
                    tone={
                      item.severity === 'critical' || item.severity === 'high'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {item.severity || '—'}
                  </Badge>
                </div>

                <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                  {item.message || item.description || '—'}
                </div>

                <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                  {formatDateTime(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px minmax(0, 1fr)',
        gap: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value || '—'}
      </div>
    </div>
  );
}