import { Link } from 'react-router-dom';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';
import { appConfig } from '../../../shared/config/appConfig';

export function SettingsPage() {
  return (
    <div className="ds-page">
      <PageHeader
        title="Настройки"
        description="Общие настройки frontend-приложения Diamond Shield"
      />

      <div className="ds-grid ds-grid-2">
        <Card title="Приложение">
          <Info label="Название" value={appConfig.appName} />
          <Info label="Версия" value={appConfig.appVersion} />
          <Info label="Build mode" value={appConfig.buildMode} />
          <Info label="Build time" value={appConfig.buildTime} />
        </Card>

        <Card title="API endpoints">
          <Info label="Central API" value={appConfig.centralApiUrl} />
          <Info label="Local API" value={appConfig.localApiUrl} />
          <Info label="Realtime" value={appConfig.realtimeUrl} />
        </Card>
      </div>

      <Card title="Диагностика">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/admin/health">
            <Button variant="secondary">Healthcheck</Button>
          </Link>

          <Link to="/admin/env">
            <Button variant="secondary">Env config</Button>
          </Link>

          <Link to="/admin/demo-checklist">
            <Button variant="secondary">Demo checklist</Button>
          </Link>

          <Link to="/central/offline-diagnostics">
            <Button variant="secondary">Offline diagnostics</Button>
          </Link>

          <Link to="/central/heartbeat-debug">
            <Button variant="secondary">Heartbeat debug</Button>
          </Link>

          <Link to="/central/realtime">
            <Button variant="secondary">Realtime</Button>
          </Link>
        </div>
      </Card>

      <Card title="Рекомендуемый порядок проверки">
        <ol style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
          <li>Проверить `/admin/health`.</li>
          <li>Проверить `/admin/env`.</li>
          <li>Войти под admin и проверить `/api/auth/me`.</li>
          <li>Проверить создание организации, объекта и локального сервера.</li>
          <li>Проверить `server_token_hash` в БД.</li>
          <li>Проверить heartbeat через `/central/heartbeat-debug`.</li>
          <li>Проверить realtime через `/central/realtime`.</li>
          <li>Пройти полный сценарий из `/admin/demo-checklist`.</li>
        </ol>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px minmax(0, 1fr)',
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