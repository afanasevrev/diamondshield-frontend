import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export function RealtimeDashboardPage() {
  const realtime = useRealtimeStream({
    enabled: true,
    showToasts: true,
    maxItems: 200,
  });

  const accessCount = realtime.events.filter(
    (item) => item.type === 'access-event',
  ).length;

  const alarmCount = realtime.events.filter(
    (item) => item.type === 'alarm-event',
  ).length;

  const deviceCount = realtime.events.filter(
    (item) => item.type === 'device-status',
  ).length;

  return (
    <div className="ds-page">
      <PageHeader
        title="Realtime"
        description="Live-события центрального сервера"
        actions={
          <>
            <Button variant="secondary" onClick={realtime.connect}>
              Подключить
            </Button>

            <Button variant="secondary" onClick={realtime.disconnect}>
              Отключить
            </Button>

            <Button variant="secondary" onClick={realtime.clearEvents}>
              Очистить
            </Button>
          </>
        }
      />

      <div className="ds-grid ds-grid-3">
        <Card title="Подключение">
          <Badge tone={realtime.connected ? 'success' : 'danger'}>
            {realtime.connected
              ? 'connected'
              : realtime.connecting
                ? 'connecting'
                : 'disconnected'}
          </Badge>

          {realtime.lastError && (
            <div style={{ marginTop: 10, color: 'var(--ds-danger)' }}>
              {realtime.lastError}
            </div>
          )}
        </Card>

        <Card title="Проходы">
          <Metric value={accessCount} label="access-event" />
        </Card>

        <Card title="Тревоги">
          <Metric value={alarmCount} label="alarm-event" />
        </Card>

        <Card title="Оборудование">
          <Metric value={deviceCount} label="device-status" />
        </Card>
      </div>

      <Card title="Последние realtime события">
        <DataTable
          data={realtime.events}
          getRowKey={(item) => item.id}
          columns={[
            {
              key: 'time',
              title: 'Получено',
              render: (item) => formatDateTime(item.receivedAt),
            },
            {
              key: 'type',
              title: 'Тип',
              render: (item) => <Badge tone="info">{item.type}</Badge>,
            },
            {
              key: 'payload',
              title: 'Payload',
              render: (item) => (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                      }}>
                {JSON.stringify(item.payload, null, 2)}
              </pre>
              ),
            },
          ]}
        />
      </Card>
    </div>);
}

function Metric({ value, label }: { value: number; label: string }) {
  return (<div>
      <div style={{ fontSize: 34, fontWeight: 900 }}>{value}</div>
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
    </div>);
}