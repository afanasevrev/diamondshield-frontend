import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { getPermissions, type Permission } from '../api/adminApi';

export function PermissionsPage() {
  const [items, setItems] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getPermissions());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки permissions');
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
        title="Permissions"
        description="Справочник прав доступа frontend/backend"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Список permissions">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'code',
                title: 'Код',
                render: (item) => <Badge tone="info">{item.code}</Badge>,
              },
              {
                key: 'module',
                title: 'Модуль',
                render: (item) => item.module || '—',
              },
              {
                key: 'name',
                title: 'Название',
                render: (item) => item.name || '—',
              },
              {
                key: 'description',
                title: 'Описание',
                render: (item) => item.description || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}