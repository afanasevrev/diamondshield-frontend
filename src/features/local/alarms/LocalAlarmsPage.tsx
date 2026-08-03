import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { getLocalAlarmEvents, type LocalAlarmEvent } from '../api/localArmApi';

function severityTone(severity?: string): 'success' | 'warning' | 'danger' | 'muted' {
  if (!severity) {
    return 'muted';
  }

  if (severity === 'critical' || severity === 'high') {
    return 'danger';
  }

  if (severity === 'medium' || severity === 'warning') {
    return 'warning';
  }

  return 'muted';
}

export function LocalAlarmsPage() {
  const [items, setItems] = useState<LocalAlarmEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getLocalAlarmEvents());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки тревог');
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
        title="Тревожные события"
        description="Взлом ИУ, долго открытая дверь, пожарная тревога и другие события"
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

      <Card title="Локальные тревоги">
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
                render: (item) => formatDateTime(item.createdAt),
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
                render: (item) => item.message || item.description || '—',
              },
              {
                key: 'point',
                title: 'Точка',
                render: (item) => item.accessPointId || '—',
              },
              {
                key: 'controller',
                title: 'Контроллер',
                render: (item) => item.controllerId || '—',
              },
              {
                key: 'sync',
                title: 'Синхр.',
                render: (item) =>
                  item.sentToCentral || item.isSynced ? (
                    <Badge tone="success">sent</Badge>
                  ) : (
                    <Badge tone="warning">new</Badge>
                  ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}