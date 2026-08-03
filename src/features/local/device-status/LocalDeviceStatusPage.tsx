import { useEffect, useState } from 'react';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  getLocalDeviceStatusEvents,
  type LocalDeviceStatusEvent,
} from '../api/localArmApi';

export function LocalDeviceStatusPage() {
  const [items, setItems] = useState<LocalDeviceStatusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getLocalDeviceStatusEvents());
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка загрузки статусов оборудования',
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
        title="Состояние оборудования"
        description="Контроллеры, считыватели, точки прохода и статусы PERCo"
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

      <Card title="События состояния оборудования">
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
                render: (item) => formatDateTime(item.createdAt || item.updatedAt),
              },
              {
                key: 'type',
                title: 'Тип устройства',
                render: (item) => item.deviceType || '—',
              },
              {
                key: 'device',
                title: 'Device ID',
                render: (item) => item.deviceId || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => <StatusDot status={item.status || 'unknown'} />,
              },
              {
                key: 'message',
                title: 'Сообщение',
                render: (item) => item.message || '—',
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