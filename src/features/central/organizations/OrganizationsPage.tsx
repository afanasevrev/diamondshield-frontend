import { type SubmitEvent, useEffect, useState } from 'react';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  createOrganization,
  getOrganizations,
  type Organization,
} from '../api/centralApi';

export function OrganizationsPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('ООО Тест');
  const [inn, setInn] = useState('7700000000');
  const [description, setDescription] = useState('Тестовая организация');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setItems(await getOrganizations());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки организаций');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createOrganization({
        name,
        inn,
        description,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания организации');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Организации"
        description="Управление организациями центрального сервера"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать организацию">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="ИНН" value={inn} onChange={(e) => setInn(e.target.value)} />
          <TextArea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </Card>

      <Card title="Список организаций">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              { key: 'inn', title: 'ИНН', render: (item) => item.inn || '—' },
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