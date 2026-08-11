import { Badge } from '../../../components/badges/Badge';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { type RealtimeAccessEvent } from '../api/realtimeTypes';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export function LiveAccessEventsPage() {
  const realtime = useRealtimeStream({
    enabled: true,
    showToasts: false,
    maxItems: 300,
  });

  const items = realtime.events
    .filter((item) => item.type === 'access-event')
    .map((item) => item.payload as RealtimeAccessEvent);

  return (
    <div className="ds-page">
      <PageHeader
        title="Live-журнал проходов"
        description="События прохода в realtime"
      />

      <Card title={`Подключение: ${realtime.connected ? 'online' : 'offline'}`}>
        <Badge tone={realtime.connected ? 'success' : 'danger'}>
          {realtime.connected ? 'connected' : 'disconnected'}
        </Badge>
      </Card>

      <Card title="Live access events">
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
              key: 'result',
              title: 'Результат',
              render: (item) => (
                <Badge
                  tone={item.accessResult === 'allowed' ? 'success' : 'danger'}
                >
                  {item.accessResult || '—'}
                </Badge>
              ),
            },
            {
              key: 'person',
              title: 'Пользователь',
              render: (item) =>
                item.personFullName || item.personId || 'Неизвестный',
            },
            {
              key: 'identifier',
              title: 'Идентификатор',
              render: (item) =>
                item.identifierMasked || item.unknownIdentifier || '—',
            },
            {
              key: 'point',
              title: 'Точка',
              render: (item) => item.accessPointId || '—',
            },
            {
              key: 'reason',
              title: 'Причина',
              render: (item) => item.reason || '—',
            },
          ]}
        />
      </Card>
    </div>
  );
}