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
  createReader,
  getAccessPoints,
  getControllers,
  getReaders,
  type Reader,
} from '../api/centralApi';

export function ReadersPage() {
  const [items, setItems] = useState<Reader[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [controllerId, setControllerId] = useState('');
  const [accessPointId, setAccessPointId] = useState('');
  const [name, setName] = useState('Считыватель вход');
  const [readerType, setReaderType] = useState('RFID');
  const [direction, setDirection] = useState('in');
  const [percoExdevNumber, setPercoExdevNumber] = useState('0');
  const [percoDirection, setPercoDirection] = useState('0');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextControllers, nextAccessPoints, nextReaders] = await Promise.all([
        getControllers(),
        getAccessPoints(),
        getReaders(),
      ]);

      setControllers(nextControllers);
      setAccessPoints(nextAccessPoints);
      setItems(nextReaders);

      if (!controllerId && nextControllers.length > 0) {
        setControllerId(nextControllers[0].id);
      }

      if (!accessPointId && nextAccessPoints.length > 0) {
        setAccessPointId(nextAccessPoints[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки считывателей');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createReader({
        controllerId,
        accessPointId,
        name,
        readerType,
        direction,
        percoExdevNumber: Number(percoExdevNumber),
        percoDirection: Number(percoDirection),
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания считывателя');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Считыватели"
        description="Считыватели карт, QR и связка с PERCo number/direction"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать считыватель">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Контроллер"
            value={controllerId}
            onChange={(e) => setControllerId(e.target.value)}
            options={controllers.map((item) => ({
              label: `${item.name} ${item.model ? `(${item.model})` : ''}`,
              value: item.id,
            }))}
          />

          <Select
            label="Точка прохода"
            value={accessPointId}
            onChange={(e) => setAccessPointId(e.target.value)}
            options={[
              { label: 'Не выбрана', value: '' },
              ...accessPoints.map((item) => ({
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

          <Select
            label="Тип"
            value={readerType}
            onChange={(e) => setReaderType(e.target.value)}
            options={[
              { label: 'RFID', value: 'RFID' },
              { label: 'QR', value: 'QR' },
              { label: 'Wiegand', value: 'Wiegand' },
              { label: 'Barcode', value: 'Barcode' },
            ]}
          />

          <Select
            label="Направление"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            options={[
              { label: 'Вход', value: 'in' },
              { label: 'Выход', value: 'out' },
            ]}
          />

          <Input
            label="PERCo ИУ number"
            type="number"
            value={percoExdevNumber}
            onChange={(e) => setPercoExdevNumber(e.target.value)}
          />

          <Input
            label="PERCo direction"
            type="number"
            value={percoDirection}
            onChange={(e) => setPercoDirection(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!controllerId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список считывателей">
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
                key: 'controller',
                title: 'Контроллер',
                render: (item) => item.controllerId || '—',
              },
              {
                key: 'point',
                title: 'Точка прохода',
                render: (item) => item.accessPointId || '—',
              },
              {
                key: 'type',
                title: 'Тип',
                render: (item) => item.readerType || '—',
              },
              {
                key: 'direction',
                title: 'Направление',
                render: (item) => item.direction || '—',
              },
              {
                key: 'perco',
                title: 'PERCo mapping',
                render: (item) =>
                  `number=${item.percoExdevNumber ?? '—'}, direction=${
                    item.percoDirection ?? '—'
                  }`,
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