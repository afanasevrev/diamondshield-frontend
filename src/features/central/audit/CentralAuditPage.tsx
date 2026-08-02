import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { type AuditEvent, getAuditEvents } from '../api/centralMonitoringApi';

export function CentralAuditPage() {
  const [items, setItems] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getAuditEvents());
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка загрузки журнала аудита',
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
        title="Журнал аудита"
        description="Действия пользователей и системные операции центрального сервера"
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

      <Card title="Аудит">
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
                key: 'user',
                title: 'Пользователь',
                render: (item) => item.username || item.userId || 'system',
              },
              {
                key: 'action',
                title: 'Действие',
                render: (item) => (
                  <Badge tone="info">{item.action || '—'}</Badge>
                ),
              },
              {
                key: 'entityType',
                title: 'Сущность',
                render: (item) => item.entityType || '—',
              },
              {
                key: 'entityId',
                title: 'Entity ID',
                render: (item) => item.entityId || '—',
              },
              {
                key: 'ip',
                title: 'IP',
                render: (item) => item.ipAddress || '—',
              },
              {
                key: 'message',
                title: 'Сообщение',
                render: (item) => item.message || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}