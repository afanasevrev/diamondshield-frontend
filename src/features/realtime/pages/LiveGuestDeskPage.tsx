import { Badge } from '../../../components/badges/Badge';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { type RealtimeGuestEvent } from '../api/realtimeTypes';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export function LiveGuestDeskPage() {
  const realtime = useRealtimeStream({
    enabled: true,
    showToasts: true,
    maxItems: 300,
  });

  const items = realtime.events
    .filter((item) => item.type === 'guest-event')
    .map((item) => item.payload as RealtimeGuestEvent);

  return (
    <div className="ds-page">
      <PageHeader
        title="Live-гостевой пост"
        description="Realtime вход/выход гостей"
      />

      <Card title={`Подключение: ${realtime.connected ? 'online' : 'offline'}`}>
        <Badge tone={realtime.connected ? 'success' : 'danger'}>
          {realtime.connected ? 'connected' : 'disconnected'}
        </Badge>
      </Card>

      <Card title="Guest realtime events">
        <DataTable
          data={items}
          getRowKey={(item) => item.id || crypto.randomUUID()}
          columns={[
            {
              key: 'time',
              title: 'Время',
              render: (item) => formatDateTime(item.eventTime),
            },
            {
              key: 'guest',
              title: 'Гость',
              render: (item) => item.guestFullName || item.guestId || '—',
            },
            {
              key: 'action',
              title: 'Действие',
              render: (item) => <Badge tone="info">{item.action || '—'}</Badge>,
            },
            {
              key: 'status',
              title: 'Статус',
              render: (item) => item.status || '—',
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