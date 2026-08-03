import { type SubmitEvent, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { PageHeader } from '../../../components/page/PageHeader';
import {
  type HeartbeatResponse,
  sendLocalServerHeartbeat,
} from '../api/centralMonitoringApi';

export function HeartbeatDebugPage() {
  const [localServerId, setLocalServerId] = useState('');
  const [localServerToken, setLocalServerToken] = useState(
    'local-server-token-123',
  );
  const [ipAddress, setIpAddress] = useState('127.0.0.1');
  const [softwareVersion, setSoftwareVersion] = useState('1.0.0');
  const [status, setStatus] = useState('online');
  const [message, setMessage] = useState('OK');

  const [response, setResponse] = useState<HeartbeatResponse | null>(null);
  const [rawResponse, setRawResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setResponse(null);
      setRawResponse('');

      const nextResponse = await sendLocalServerHeartbeat(
        localServerId.trim(),
        localServerToken,
        {
          ipAddress,
          softwareVersion,
          status,
          message,
        },
      );

      setResponse(nextResponse);
      setRawResponse(JSON.stringify(nextResponse, null, 2));
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка отправки heartbeat',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-page">
      <PageHeader
        title="Heartbeat debug"
        description="Ручная проверка X-Local-Server-Id и X-Local-Server-Token"
      />

      {error && <ErrorMessage message={error} />}

      <Card
        title="Отправить heartbeat"
        subtitle="Если token hash пустой или неверный, центральный сервер вернет 401"
      >
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Input
            label="X-Local-Server-Id"
            value={localServerId}
            onChange={(e) => setLocalServerId(e.target.value)}
            placeholder="UUID local server"
          />

          <Input
            label="X-Local-Server-Token"
            value={localServerToken}
            onChange={(e) => setLocalServerToken(e.target.value)}
          />

          <Input
            label="ipAddress"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />

          <Input
            label="softwareVersion"
            value={softwareVersion}
            onChange={(e) => setSoftwareVersion(e.target.value)}
          />

          <Input
            label="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <TextArea
            label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={loading || !localServerId}>
              {loading ? 'Отправка...' : 'Отправить heartbeat'}
            </Button>
          </div>
        </form>
      </Card>

      {response && (
        <Card title="Ответ центрального сервера">
          <div style={{ display: 'grid', gap: 12 }}>
            <Badge tone="success">Heartbeat accepted</Badge>

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
              {rawResponse}
            </pre>
          </div>
        </Card>
      )}

      <Card title="Как интерпретировать результат">
        <ul style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
          <li>
            <strong>200/OK</strong> — токен прошел проверку, local server должен
            стать online.
          </li>
          <li>
            <strong>401 Unauthorized</strong> — неверный token, пустой
            server_token_hash или local server не найден.
          </li>
          <li>
            <strong>403 Forbidden</strong> — endpoint закрыт Spring Security.
          </li>
          <li>
            <strong>404 Not Found</strong> — endpoint называется иначе или не
            подключен.
          </li>
        </ul>
      </Card>
    </div>
  );
}