import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  type HealthCheckResult,
  runHealthChecks,
} from '../api/systemApi';

export function HealthPage() {
  const [items, setItems] = useState<HealthCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawVisible, setRawVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await runHealthChecks());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка healthcheck');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const okCount = items.filter((item) => item.ok).length;
  const failCount = items.filter((item) => !item.ok).length;

  return (
    <div className="ds-page">
      <PageHeader
        title="Healthcheck"
        description="Проверка доступности backend-сервисов"
        actions={
          <>
            <Button variant="secondary" onClick={load}>
              Повторить
            </Button>

            <Button
              variant="secondary"
              onClick={() => setRawVisible((value) => !value)}
            >
              Raw JSON: {rawVisible ? 'hide' : 'show'}
            </Button>
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      <div className="ds-grid ds-grid-3">
        <Card title="OK">
          <Metric value={okCount} label="успешных проверок" />
        </Card>

        <Card title="Fail">
          <Metric value={failCount} label="ошибок" danger />
        </Card>

        <Card title="Status">
          <Badge tone={failCount === 0 ? 'success' : 'danger'}>
            {failCount === 0 ? 'healthy' : 'problems'}
          </Badge>
        </Card>
      </div>

      <Card title="Проверки">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.name}
            columns={[
              {
                key: 'name',
                title: 'Проверка',
                render: (item) => item.name,
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={item.ok ? 'success' : 'danger'}>
                    {item.ok ? 'OK' : 'FAIL'}
                  </Badge>
                ),
              },
              {
                key: 'http',
                title: 'HTTP',
                render: (item) => item.status || '—',
              },
              {
                key: 'url',
                title: 'URL',
                render: (item) => (
                  <pre style={{ overflowWrap: 'anywhere' }}>{item.url} </pre>
                  ),
              },
              {
                key: 'message',
                title: 'Сообщение',
                render: (item) => item.message,
              },
            ]}
          />)}
      </Card>

      {rawVisible && (<Card title="Raw response">
          <pre
            style={{
              overflow: 'auto',
              maxHeight: 520,
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--ds-border)',
              background: 'rgba(2, 10, 20, 0.45)',
              color: 'var(--ds-text-soft)',
            }}
          >
            {JSON.stringify(items, null, 2)}
          </pre>
        </Card>)}

      <Card title="Если healthcheck упал">
        <ol style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
          <li>Проверь, запущен ли центральный backend на 8080.</li>
          <li>Проверь, запущен ли локальный backend на 8090.</li>
          <li>Проверь `VITE_CENTRAL_API_URL` и `VITE_LOCAL_API_URL`.</li>
          <li>Проверь CORS в Spring Security.</li>
          <li>Проверь, что `/api/health` открыт без JWT.</li>
          <li>Если `/api/auth/me` возвращает 401 — войди заново.</li>
        </ol>
      </Card>
    </div>);
}

function Metric({
  value,
  label,
  danger,
}: {
  value: number;
  label: string;
  danger?: boolean;
}) {
  return (<div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          color: danger? 'var(--ds-danger)': 'var(--ds-text)',
        }}
      >
        {value}
      </div>

      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
    </div>);
}