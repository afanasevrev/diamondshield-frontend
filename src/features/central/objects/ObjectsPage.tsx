import { type SubmitEvent, useEffect, useState } from 'react';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { TextArea } from '../../../components/forms/TextArea';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  createObject,
  type DsObject,
  getObjects,
  getOrganizations,
  type Organization,
} from '../api/centralApi';

export function ObjectsPage() {
  const [objects, setObjects] = useState<DsObject[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [organizationId, setOrganizationId] = useState('');
  const [name, setName] = useState('Главный офис');
  const [address, setAddress] = useState('Москва, тестовая улица, 1');
  const [description, setDescription] = useState('Тестовый объект');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [orgs, objs] = await Promise.all([getOrganizations(), getObjects()]);

      setOrganizations(orgs);
      setObjects(objs);

      if (!organizationId && orgs.length > 0) {
        setOrganizationId(orgs[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки объектов');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createObject({
        organizationId,
        name,
        address,
        description,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания объекта');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Объекты"
        description="Объекты, подключенные к Diamond Shield"
        actions={<Button variant="secondary" onClick={load}>Обновить</Button>}
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать объект">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Select
            label="Организация"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            options={organizations.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />

          <Input label="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} />

          <TextArea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!organizationId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список объектов">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={objects}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              { key: 'address', title: 'Адрес', render: (item) => item.address || '—' },
              {
                key: 'organizationId',
                title: 'Организация',
                render: (item) => item.organizationId || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}