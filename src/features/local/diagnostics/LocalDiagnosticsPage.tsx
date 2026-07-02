import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  getLocalDiagnosticsStatus,
  type LocalDiagnosticsStatus,
  pullLocalConfig,
  pushLocalEvents,
} from './localDiagnosticsApi';

export function LocalDiagnosticsPage() {
  const [data, setData] = useState<LocalDiagnosticsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);

      const response = await getLocalDiagnosticsStatus();

      setData(response);
    } catch (ex) {
      const message =
        ex instanceof Error
          ? ex.message
          : 'Не удалось получить диагностику локального сервера';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePullConfig() {
    try {
      setActionLoading(true);
      setActionMessage(null);

      await pullLocalConfig();

      setActionMessage('Конфигурация запрошена с центрального сервера');
      await load();
    } catch (ex) {
      setActionMessage(
        ex instanceof Error ? ex.message : 'Ошибка загрузки конфигурации',
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePushEvents() {
    try {
      setActionLoading(true);
      setActionMessage(null);

      const response = await pushLocalEvents();

      setActionMessage(
        `Отправлено событий: ${response.total}. Проходы: ${response.accessEvents}, тревоги: ${response.alarmEvents}, статусы: ${response.deviceStatuses}`,
      );

      await load();
    } catch (ex) {
      setActionMessage(
        ex instanceof Error ? ex.message : 'Ошибка отправки событий',
      );
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Диагностика локального сервера"
        description="Проверка состояния локальной БД, очередей событий, синхронизации и PERCo"
        actions={
          <>
            <Button variant="secondary" onClick={load} disabled={loading}>
              Обновить
            </Button>

            <Button
              variant="secondary"
              onClick={handlePullConfig}
              disabled={actionLoading}
            >
              Pull config
            </Button>

            <Button onClick={handlePushEvents} disabled={actionLoading}>
              Push events
            </Button>
          </>
        }
      />

      {loading && <Loading />}

      {error && <ErrorMessage message={error} />}

      {actionMessage && (
        <Card>
          <Badge tone="info">{actionMessage}</Badge>
        </Card>
      )}

      {data && (
        <>
          <div className="ds-grid ds-grid-3">
            <Card title="Сервер" subtitle="Основная информация">
              <InfoList
                items={[
                  ['Application', data.application],
                  ['Status', <StatusDot status={data.status} />],
                  ['Server time', formatDateTime(data.serverTime)],
                  ['Local server ID', data.localServerId],
                  ['Object ID', data.objectId || '—'],
                ]}
              />
            </Card>

            <Card title="Центральный сервер" subtitle="Связь и синхронизация">
              <InfoList
                items={[
                  ['Central URL', data.centralBaseUrl],
                  ['Last config pull', formatDateTime(data.lastConfigPullAt)],
                  [
                    'Last successful push',
                    formatDateTime(data.lastSuccessfulPushAt),
                  ],
                ]}
              />
            </Card>

            <Card title="PERCo C01" subtitle="Параметры интеграции">
              <InfoList
                items={[
                  [
                    'Enabled',
                    data.percoEnabled ? (
                      <Badge tone="success">enabled</Badge>
                    ) : (
                      <Badge tone="muted">disabled</Badge>
                    ),
                  ],
                  ['WebSocket path', data.percoWebsocketPath],
                  ['Open type', data.percoDefaultOpenType],
                  ['Open time', data.percoDefaultOpenTimeMs],
                  ['Identifier type', data.percoIdentifierType],
                ]}
              />
            </Card>
          </div>

          <div className="ds-grid ds-grid-3">
            <Card title="Конфигурация объекта" subtitle="Локальная копия">
              <InfoList
                items={[
                  ['Controllers', data.controllers],
                  ['Readers', data.readers],
                  ['Access points', data.accessPoints],
                  ['Persons', data.persons],
                  ['Identifiers', data.identifiers],
                  ['Access rules', data.accessRules],
                  ['Schedules', data.schedules],
                  ['Schedule intervals', data.scheduleIntervals],
                ]}
              />
            </Card>

            <Card title="События доступа" subtitle="Очередь отправки">
              <InfoList
                items={[
                  ['Total', data.accessEvents],
                  ['Sent', data.sentAccessEvents],
                  [
                    'Unsent',
                    <Badge
                      tone={
                        data.unsentAccessEvents && data.unsentAccessEvents > 0
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {data.unsentAccessEvents ?? 0}
                    </Badge>,
                  ],
                ]}
              />
            </Card>

            <Card title="Тревоги и статусы" subtitle="Локальные очереди">
              <InfoList
                items={[
                  ['Alarm total', data.alarmEvents],
                  ['Alarm unsent', data.unsentAlarmEvents],
                  ['Device statuses', data.deviceStatusEvents],
                  ['Device unsent', data.unsentDeviceStatusEvents],
                ]}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function InfoList({
  items,
}: {
  items: Array<[string, React.ReactNode]>;
}) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.map(([label, value]) => (
        <div
          key={label}
          style={{
            display: 'grid',
            gridTemplateColumns: '150px minmax(0, 1fr)',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
            {label}
          </div>
          <div
            style={{
              color: 'var(--ds-text-soft)',
              fontSize: 13,
              overflowWrap: 'anywhere',
            }}
          >
            {value ?? '—'}
          </div>
        </div>
      ))}
    </div>
  );
}