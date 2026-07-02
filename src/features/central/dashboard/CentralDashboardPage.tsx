import { Badge } from '../../../components/badges/Badge';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';

export function CentralDashboardPage() {
  return (
    <div className="ds-page">
      <PageHeader
        title="Панель мониторинга"
        description="Общее состояние центрального сервера Diamond Shield"
      />

      <div className="ds-grid ds-grid-3">
        <Card title="Объекты" subtitle="Подключенные объекты системы">
          <Metric value="0" label="Всего объектов" />
        </Card>

        <Card title="Локальные серверы" subtitle="Статус связи с объектами">
          <div style={{ display: 'grid', gap: 10 }}>
            <StatusDot status="online" label="online: 0" />
            <StatusDot status="offline" label="offline: 0" />
          </div>
        </Card>

        <Card title="События сегодня" subtitle="Проходы и тревоги">
          <div style={{ display: 'grid', gap: 10 }}>
            <Metric value="0" label="Проходов" />
            <Badge tone="danger">Тревог: 0</Badge>
          </div>
        </Card>
      </div>

      <Card
        title="Следующие шаги"
        subtitle="Эта страница будет подключена к API центрального сервера на следующих этапах"
      >
        <ul style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
          <li>Получить статистику объектов.</li>
          <li>Показать состояние локальных серверов.</li>
          <li>Показать последние события прохода.</li>
          <li>Показать активные тревоги.</li>
        </ul>
      </Card>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 34, fontWeight: 900 }}>{value}</div>
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
    </div>
  );
}