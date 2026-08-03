import { useEffect, useState } from 'react';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  getLocalAccessPoints,
  type LocalAccessPoint,
} from '../api/localArmApi';

export function LocalAccessPointsPage() {
  const [items, setItems] = useState<LocalAccessPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getLocalAccessPoints());
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка загрузки точек доступа',
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
        title="Локальные точки доступа"
        description="Точки прохода, синхронизированные на локальный сервер"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Точки доступа объекта">
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
                render: (item) => item.centralAccessPointId || '—',
              },
              {
                key: 'controller',
                title: 'Контроллер',
                render: (item) => item.controllerId || item.localControllerId || '—',
              },
              {
                key: 'type',
                title: 'Тип',
                render: (item) => item.accessPointType || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => <StatusDot status={item.status || 'unknown'} />,
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}