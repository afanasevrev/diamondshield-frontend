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
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  createLocalServer,
  type DsObject,
  getLocalServers,
  getObjects,
  type LocalServer,
} from '../api/centralApi';

export function LocalServersPage() {
  const [items, setItems] = useState<LocalServer[]>([]);
  const [objects, setObjects] = useState<DsObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [objectId, setObjectId] = useState('');
  const [name, setName] = useState('Локальный сервер объекта');
  const [ipAddress, setIpAddress] = useState('192.168.1.10');
  const [macAddress, setMacAddress] = useState('');
  const [softwareVersion, setSoftwareVersion] = useState('1.0.0');
  const [serverToken, setServerToken] = useState('local-server-token-123');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextObjects, nextItems] = await Promise.all([
        getObjects(),
        getLocalServers(),
      ]);

      setObjects(nextObjects);
      setItems(nextItems);

      if (!objectId && nextObjects.length > 0) {
        setObjectId(nextObjects[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки локальных серверов');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createLocalServer({
        objectId,
        name,
        ipAddress,
        macAddress,
        softwareVersion,
        serverToken,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания локального сервера');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Локальные серверы"
        description="Локальные серверы объектов и их состояние"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать локальный сервер">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Объект"
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
            options={objects.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Input
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="IP-адрес"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />

          <Input
            label="MAC-адрес"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
          />

          <Input
            label="Версия ПО"
            value={softwareVersion}
            onChange={(e) => setSoftwareVersion(e.target.value)}
          />

          <Input
            label="Токен локального сервера"
            value={serverToken}
            onChange={(e) => setServerToken(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!objectId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список локальных серверов">
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
                key: 'ip',
                title: 'IP',
                render: (item) => item.ipAddress || '—',
              },
              {
                key: 'version',
                title: 'Версия',
                render: (item) => item.softwareVersion || '—',
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