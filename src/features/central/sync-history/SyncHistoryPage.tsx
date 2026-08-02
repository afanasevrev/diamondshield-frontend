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
  getSyncHistory,
  type SyncHistoryItem,
} from '../api/centralMonitoringApi';

function statusTone(status?: string | null): 'success' | 'warning' | 'danger' | 'muted' {
  if (!status) {
    return 'muted';
  }

  const normalized = status.toLowerCase();

  if (normalized === 'ok' || normalized === 'success' || normalized === 'completed') {
    return 'success';
  }

  if (normalized === 'processing' || normalized === 'partial') {
    return 'warning';
  }

  if (normalized === 'error' || normalized === 'failed') {
    return 'danger';
  }

  return 'muted';
}

export function SyncHistoryPage() {
  const [items, setItems] = useState<SyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getSyncHistory());
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка загрузки истории синхронизации',
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

    const timer = window.setInterval(load, 10000);

    return () => window.clearInterval(timer);
  }, [autoRefresh]);

  return (
    <div className="ds-page">
      <PageHeader
        title="История синхронизации"
        description="Pull config, push events, heartbeat и другие операции локальных серверов"
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

      <Card title="Операции синхронизации">
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
                  formatDateTime(item.startedAt || item.createdAt),
              },
              {
                key: 'operation',
                title: 'Операция',
                render: (item) => item.operation || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={statusTone(item.status)}>
                    {item.status || '—'}
                  </Badge>
                ),
              },
              {
                key: 'localServer',
                title: 'Local server',
                render: (item) => item.localServerId || '—',
              },
              {
                key: 'object',
                title: 'Object',
                render: (item) => item.objectId || '—',
              },
              {
                key: 'counts',
                title: 'Счетчики',
                render: (item) =>
                  `access=${item.accessEvents ?? 0}, alarms=${
                    item.alarmEvents ?? 0
                  }, statuses=${item.deviceStatuses ?? 0}`,
              },
              {
                key: 'message',
                title: 'Сообщение',
                render: (item) => item.message || '—',
              },
              {
                key: 'finishedAt',
                title: 'Завершено',
                render: (item) => formatDateTime(item.finishedAt),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}