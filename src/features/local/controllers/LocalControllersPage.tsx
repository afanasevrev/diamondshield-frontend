import { useEffect, useState } from 'react';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  getLocalControllers,
  type LocalController,
} from '../api/localArmApi';

export function LocalControllersPage() {
  const [items, setItems] = useState<LocalController[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getLocalControllers());
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка загрузки контроллеров',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Локальные контроллеры"
        description="Контроллеры объекта, включая несколько PERCo C01"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Контроллеры">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              {
                key: 'central',
                title: 'Central ID',
                render: (item) => item.centralControllerId || '—',
              },
              {
                key: 'model',
                title: 'Модель',
                render: (item) => item.model || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => <StatusDot status={item.status || 'unknown'} />,
              },
              {
                key: 'ip',
                title: 'IP:порт',
                render: (item) =>
                  `${item.ipAddress || '—'}${item.port ? `:${item.port}` : ''}`,
              },
              {
                key: 'lastSeen',
                title: 'Последняя связь',
                render: (item) => formatDateTime(item.lastSeenAt),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}