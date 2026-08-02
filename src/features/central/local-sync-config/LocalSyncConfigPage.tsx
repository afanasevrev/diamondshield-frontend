import { FormEvent, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Input } from '../../../components/forms/Input';
import { PageHeader } from '../../../components/page/PageHeader';
import {
  getLocalSyncConfig,
  LocalSyncConfigResponse,
} from '../api/centralMonitoringApi';

function count(value?: unknown[]) {
  return Array.isArray(value) ? value.length : 0;
}

export function LocalSyncConfigPage() {
  const [localServerId, setLocalServerId] = useState('');
  const [localServerToken, setLocalServerToken] = useState(
    'local-server-token-123',
  );
  const [data, setData] = useState<LocalSyncConfigResponse | null>(null);
  const [rawVisible, setRawVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setData(null);

      const response = await getLocalSyncConfig(
        localServerId.trim(),
        localServerToken,
      );

      setData(response);
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка получения local-sync config',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-page">
      <PageHeader
        title="Local-sync config"
        description="Проверка конфигурации, которую центральный сервер отдает локальному серверу"
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Запрос конфигурации">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Input
            label="X-Local-Server-Id"
            value={localServerId}
            onChange={(e) => setLocalServerId(e.target.value)}
            placeholder="UUID локального сервера"
          />

          <Input
            label="X-Local-Server-Token"
            value={localServerToken}
            onChange={(e) => setLocalServerToken(e.target.value)}
            placeholder="local-server-token-123"
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={loading || !localServerId}>
              {loading ? 'Загрузка...' : 'Получить config'}
            </Button>
          </div>
        </form>
      </Card>

      {data && (
        <>
          <div className="ds-grid ds-grid-3">
            <Card title="Основное">
              <Info label="Local server ID" value={data.localServerId || '—'} />
              <Info label="Object ID" value={data.objectId || '—'} />
            </Card>

            <Card title="Оборудование">
              <Metric label="Controllers" value={count(data.controllers)} />
              <Metric label="Readers" value={count(data.readers)} />
              <Metric label="Access points" value={count(data.accessPoints)} />
            </Card>

            <Card title="Доступ">
              <Metric label="Persons" value={count(data.persons)} />
              <Metric label="Identifiers" value={count(data.identifiers)} />
              <Metric label="Access rules" value={count(data.accessRules)} />
            </Card>
          </div>

          <Card
            title="Расписания"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRawVisible((value) => !value)}
              >
                Raw JSON: {rawVisible ? 'hide' : 'show'}
              </Button>
            }
          >
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Badge tone="info">Schedules: {count(data.schedules)}</Badge>
              <Badge tone="info">
                Schedule intervals: {count(data.scheduleIntervals)}
              </Badge>
            </div>

            {rawVisible && (
              <pre
                style={{
                  marginTop: 16,
                  overflow: 'auto',
                  maxHeight: 520,
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--ds-border)',
                  background: 'rgba(2, 10, 20, 0.45)',
                  color: 'var(--ds-text-soft)',
                }}
              >
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px minmax(0, 1fr)',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
    </div>
  );
}