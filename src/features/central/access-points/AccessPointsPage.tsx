import { type SubmitEvent, useEffect, useState } from 'react';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  type AccessPoint,
  type Controller,
  createAccessPoint,
  type DsObject,
  getAccessPoints,
  getControllers,
  getObjects,
} from '../api/centralApi';

export function AccessPointsPage() {
  const [items, setItems] = useState<AccessPoint[]>([]);
  const [objects, setObjects] = useState<DsObject[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [objectId, setObjectId] = useState('');
  const [controllerId, setControllerId] = useState('');
  const [name, setName] = useState('Главный вход');
  const [accessPointType, setAccessPointType] = useState('door');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [objs, points, nextControllers] = await Promise.all([
        getObjects(),
        getAccessPoints(),
        getControllers(),
      ]);

      setObjects(objs);
      setItems(points);
      setControllers(nextControllers);

      if (!objectId && objs.length > 0) {
        setObjectId(objs[0].id);
      }

      if (!controllerId && nextControllers.length > 0) {
        setControllerId(nextControllers[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки точек прохода');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      const payload: any = {
        objectId,
        name,
        accessPointType,
        active: true,
      };

      if (controllerId) {
        payload.controllerId = controllerId;
      }

      await createAccessPoint(payload);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания точки прохода');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredControllers = controllers.filter(
    (controller) => !objectId || controller.objectId === objectId,
  );

  return (
    <div className="ds-page">
      <PageHeader
        title="Точки прохода"
        description="Двери, турникеты, шлагбаумы и другие точки доступа"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать точку прохода">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Select
            label="Объект"
            value={objectId}
            onChange={(e) => {
              setObjectId(e.target.value);
              setControllerId('');
            }}
            options={objects.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Select
            label="Контроллер"
            value={controllerId}
            onChange={(e) => setControllerId(e.target.value)}
            options={[
              { label: 'Без контроллера', value: '' },
              ...filteredControllers.map((item) => ({
                label: `${item.name} ${item.model ? `(${item.model})` : ''}`,
                value: item.id,
              })),
            ]}
          />

          <Select
            label="Тип"
            value={accessPointType}
            onChange={(e) => setAccessPointType(e.target.value)}
            options={[
              { label: 'Дверь', value: 'door' },
              { label: 'Турникет', value: 'turnstile' },
              { label: 'Шлагбаум', value: 'gate' },
            ]}
          />

          <Input
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!objectId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список точек прохода">
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
                key: 'type',
                title: 'Тип',
                render: (item) => item.accessPointType || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => <StatusDot status={item.status || 'active'} />,
              },
              {
                key: 'objectId',
                title: 'Объект',
                render: (item) => item.objectId || '—',
              },
              {
                key: 'controllerId',
                title: 'Контроллер',
                render: (item) => item.controllerId || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}