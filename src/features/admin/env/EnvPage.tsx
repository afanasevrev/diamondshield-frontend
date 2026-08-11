import { Badge } from '../../../components/badges/Badge';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { appConfig } from '../../../shared/config/appConfig';

interface EnvRow {
  key: string;
  value: string;
  required: boolean;
  ok: boolean;
  description: string;
}

export function EnvPage() {
  const rows: EnvRow[] = [
    {
      key: 'VITE_APP_NAME',
      value: appConfig.appName,
      required: false,
      ok: Boolean(appConfig.appName),
      description: 'Название приложения',
    },
    {
      key: 'VITE_APP_VERSION',
      value: appConfig.appVersion,
      required: false,
      ok: Boolean(appConfig.appVersion),
      description: 'Версия приложения',
    },
    {
      key: 'VITE_CENTRAL_API_URL',
      value: appConfig.centralApiUrl,
      required: true,
      ok: Boolean(appConfig.centralApiUrl),
      description: 'URL центрального backend',
    },
    {
      key: 'VITE_LOCAL_API_URL',
      value: appConfig.localApiUrl,
      required: true,
      ok: Boolean(appConfig.localApiUrl),
      description: 'URL локального backend',
    },
    {
      key: 'VITE_REALTIME_URL',
      value: appConfig.realtimeUrl,
      required: false,
      ok: Boolean(appConfig.realtimeUrl),
      description: 'URL realtime SSE stream',
    },
    {
      key: 'VITE_DEFAULT_LOCAL_SERVER_TOKEN',
      value: appConfig.defaultLocalServerToken,
      required: false,
      ok: Boolean(appConfig.defaultLocalServerToken),
      description: 'Токен по умолчанию для debug heartbeat',
    },
  ];

  const failed = rows.filter((item) => item.required && !item.ok);

  return (
    <div className="ds-page">
      <PageHeader
        title="Env config"
        description="Диагностика переменных окружения frontend"
      />

      <div className="ds-grid ds-grid-2">
        <Card title="Статус">
          <Badge tone={failed.length === 0 ? 'success' : 'danger'}>
            {failed.length === 0 ? 'env ok' : 'env problems'}
          </Badge>
        </Card>

        <Card title="Build">
          <Info label="Mode" value={appConfig.buildMode} />
          <Info label="Build time" value={appConfig.buildTime} />
        </Card>
      </div>

      <Card title="Переменные">
        <DataTable
          data={rows}
          getRowKey={(item) => item.key}
          columns={[
            {
              key: 'key',
              title: 'Ключ',
              render: (item) => <code>{item.key} </code>
              ,
            },
            {
              key: 'value',
              title: 'Значение',
              render: (item) => (<code style={{ overflowWrap: 'anywhere' }}>{item.value}</code>),
            },
            {
              key: 'required',
              title: 'Required',
              render: (item) => (item.required? 'yes': 'no'),
            },
            {
              key: 'ok',
              title: 'OK',
              render: (item) => (<Badge tone={item.ok? 'success': 'danger'}>
                  {item.ok? 'OK': 'FAIL'}
                </Badge>),
            },
            {
              key: 'description',
              title: 'Описание',
              render: (item) => item.description,
            },
          ]}
        />
      </Card>

      <Card title=".env.example">
        <pre
          style={{
            overflow: 'auto',
            padding: 16,
            borderRadius: 12,
            border: '1px solid var(--ds-border)',
            background: 'rgba(2, 10, 20, 0.45)',
            color: 'var(--ds-text-soft)',
          }}
        >
        {`
            VITE_APP_NAME=Diamond Shield
            VITE_APP_VERSION=0.1.0
            VITE_CENTRAL_API_URL=http://localhost:8080
            VITE_LOCAL_API_URL=http://localhost:8090
            VITE_REALTIME_URL=http://localhost:8080/api/realtime/stream
            VITE_DEFAULT_LOCAL_SERVER_TOKEN=local-server-token-123
            VITE_BUILD_TIME=local
        `}
        </pre>
      </Card>
    </div>);
}

function Info({ label, value }: { label: string; value: string }) {
  return (<div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px minmax(0, 1fr)',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>);
}