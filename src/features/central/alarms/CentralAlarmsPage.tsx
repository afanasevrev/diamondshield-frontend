import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  type CentralAlarmEvent,
  getCentralAlarmEvents,
} from '../api/centralMonitoringApi';

function severityTone(
  severity?: string | null,
): 'success' | 'warning' | 'danger' | 'muted' {
  if (!severity) {
    return 'muted';
  }

  const normalized = severity.toLowerCase();

  if (normalized === 'critical' || normalized === 'high') {
    return 'danger';
  }

  if (normalized === 'medium' || normalized === 'warning') {
    return 'warning';
  }

  return 'muted';
}

export function CentralAlarmsPage() {
  const [items, setItems] = useState<CentralAlarmEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getCentralAlarmEvents());
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка загрузки центрального журнала тревог',
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

  return (
    <div className="ds-page">
      <PageHeader
        title="Центральный журнал тревог"
        description="Тревоги, полученные от локальных серверов объектов"
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
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Тревожные события">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'time',
                title: 'Время',
                render: (item) =>
                  formatDateTime(item.eventTime || item.receivedAt || item.createdAt),
              },
              {
                key: 'type',
                title: 'Тип',
                render: (item) => item.alarmType || '—',
              },
              {
                key: 'severity',
                title: 'Важность',
                render: (item) => (
                  <Badge tone={severityTone(item.severity)}>
                    {item.severity || '—'}
                  </Badge>
                ),
              },
              {
                key: 'message',
                title: 'Сообщение',
                render: (item) => item.message || '—',
              },
              {
                key: 'object',
                title: 'Объект',
                render: (item) => item.objectId || '—',
              },
              {
                key: 'localServer',
                title: 'Локальный сервер',
                render: (item) => item.localServerId || '—',
              },
              {
                key: 'controller',
                title: 'Контроллер',
                render: (item) => item.controllerId || '—',
              },
              {
                key: 'point',
                title: 'Точка прохода',
                render: (item) => item.accessPointId || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}