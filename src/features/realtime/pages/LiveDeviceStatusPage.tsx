import { StatusDot } from '../../../components/badges/StatusDot';
import { Badge } from '../../../components/badges/Badge';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { type RealtimeDeviceStatusEvent } from '../api/realtimeTypes';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export function LiveDeviceStatusPage() {
  const realtime = useRealtimeStream({
    enabled: true,
    showToasts: true,
    maxItems: 300,
  });

  const items = realtime.events
    .filter((item) => item.type === 'device-status')
    .map((item) => item.payload as RealtimeDeviceStatusEvent);

  return (
    <div className="ds-page">
      <PageHeader
        title="Live-состояние оборудования"
        description="Контроллеры, считыватели, PERCo и локальные серверы"
      />

      <Card title={`Подключение: ${realtime.connected ? 'online' : 'offline'}`}>
        <Badge tone={realtime.connected ? 'success' : 'danger'}>
          {realtime.connected ? 'connected' : 'disconnected'}
        </Badge>
      </Card>

      <Card title="Live device status">
        <DataTable
          data={items}
          getRowKey={(item) => item.id || crypto.randomUUID()}
          columns={[
            {
              key: 'time',
              title: 'Время',
              render: (item) => formatDateTime(item.createdAt),
            },
            {
              key: 'type',
              title: 'Тип',
              render: (item) => item.deviceType || '—',
            },
            {
              key: 'id',
              title: 'Device ID',
              render: (item) => item.deviceId || '—',
            },
            {
              key: 'status',
              title: 'Статус',
              render: (item) => <StatusDot status={item.status || 'unknown'} />,
            },
            {
              key: 'message',
              title: 'Сообщение',
              render: (item) => item.message || '—',
            },
          ]}
        />
      </Card>
    </div>
  );
}