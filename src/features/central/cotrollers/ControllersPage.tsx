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
  type Controller,
  createController,
  type DsObject,
  getControllers,
  getLocalServers,
  getObjects,
  type LocalServer,
} from '../api/centralApi';

export function ControllersPage() {
  const [items, setItems] = useState<Controller[]>([]);
  const [objects, setObjects] = useState<DsObject[]>([]);
  const [localServers, setLocalServers] = useState<LocalServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [objectId, setObjectId] = useState('');
  const [localServerId, setLocalServerId] = useState('');
  const [name, setName] = useState('PERCo C01 - Главный вход');
  const [model, setModel] = useState('PERCo C01');
  const [serialNumber, setSerialNumber] = useState('PERCO-C01-001');
  const [ipAddress, setIpAddress] = useState('192.168.1.20');
  const [port, setPort] = useState('80');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextObjects, nextLocalServers, nextControllers] = await Promise.all([
        getObjects(),
        getLocalServers(),
        getControllers(),
      ]);

      setObjects(nextObjects);
      setLocalServers(nextLocalServers);
      setItems(nextControllers);

      if (!objectId && nextObjects.length > 0) {
        setObjectId(nextObjects[0].id);
      }

      if (!localServerId && nextLocalServers.length > 0) {
        setLocalServerId(nextLocalServers[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки контроллеров');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createController({
        objectId,
        localServerId,
        name,
        model,
        serialNumber,
        ipAddress,
        port: Number(port),
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания контроллера');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredLocalServers = localServers.filter(
    (server) => !objectId || server.objectId === objectId,
  );

  return (
    <div className="ds-page">
      <PageHeader
        title="Контроллеры"
        description="Контроллеры доступа, включая несколько PERCo C01 на одном объекте"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать контроллер">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Объект"
            value={objectId}
            onChange={(e) => {
              setObjectId(e.target.value);
              setLocalServerId('');
            }}
            options={objects.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Select
            label="Локальный сервер"
            value={localServerId}
            onChange={(e) => setLocalServerId(e.target.value)}
            options={[
              { label: 'Не выбран', value: '' },
              ...filteredLocalServers.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            ]}
          />

          <Input
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Модель"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <Input
            label="Серийный номер"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />

          <Input
            label="IP-адрес"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />

          <Input
            label="Порт"
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!objectId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список контроллеров">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              { key: 'model', title: 'Модель', render: (item) => item.model || '—' },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => <StatusDot status={item.status || 'offline'} />,
              },
              {
                key: 'object',
                title: 'Объект',
                render: (item) => item.objectId || '—',
              },
              {
                key: 'localServer',
                title: 'Локальный сервер',
                render: (item) => item.localServerId || '—',
              },
              {
                key: 'ip',
                title: 'IP:порт',
                render: (item) =>
                  `${item.ipAddress || '—'}${item.port ? `:${item.port}` : ''}`,
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}