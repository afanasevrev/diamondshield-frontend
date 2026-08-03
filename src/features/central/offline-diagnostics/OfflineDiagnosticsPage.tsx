import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/badges/Badge';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Select } from '../../../components/forms/Select';
import { PageHeader } from '../../../components/page/PageHeader';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { getLocalServers, type LocalServer } from '../api/centralApi';

export function OfflineDiagnosticsPage() {
  const [items, setItems] = useState<LocalServer[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const response = await getLocalServers();

      setItems(response);

      if (!selectedId && response.length > 0) {
        setSelectedId(response[0].id);
      }
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка загрузки локальных серверов',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId],
  );

  const isOnline = selected?.status?.toLowerCase() === 'online';

  return (
    <div className="ds-page">
      <PageHeader
        title="Диагностика offline"
        description="Проверка причин, почему локальный сервер не отображается online"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loading />
      ) : (
        <>
          <Card title="Выбор local server">
            <Select
              label="Локальный сервер"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              options={items.map((item) => ({
                label: `${item.name} (${item.status || 'unknown'})`,
                value: item.id,
              }))}
            />
          </Card>

          {selected && (
            <>
              <div className="ds-grid ds-grid-3">
                <Card title="Статус">
                  <div style={{ display: 'grid', gap: 12 }}>
                    <StatusDot
                      status={selected.status || 'unknown'}
                      label={selected.status || 'unknown'}
                    />

                    <Info label="ID" value={selected.id} />
                    <Info label="Object ID" value={selected.objectId || '—'} />
                    <Info label="IP" value={selected.ipAddress || '—'} />
                    <Info
                      label="Версия"
                      value={selected.softwareVersion || '—'}
                    />
                    <Info
                      label="Last seen"
                      value={formatDateTime(selected.lastSeenAt)}
                    />
                  </div>
                </Card>

                <Card title="Heartbeat">
                  <div style={{ display: 'grid', gap: 12 }}>
                    {isOnline ? (
                      <Badge tone="success">local server online</Badge>
                    ) : (
                      <Badge tone="danger">local server offline</Badge>
                    )}

                    <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                      Online появляется только после успешного POST
                      /api/local-sync/heartbeat.
                    </div>

                    <Link to="/central/heartbeat-debug">
                      <Button variant="secondary" size="sm">
                        Открыть heartbeat debug
                      </Button>
                    </Link>
                  </div>
                </Card>

                <Card title="Local-sync config">
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                      Если heartbeat проходит, проверь, что центральный сервер
                      отдает конфигурацию для этого localServerId.
                    </div>

                    <Link to="/central/local-sync-config">
                      <Button variant="secondary" size="sm">
                        Проверить config
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              <Card title="Что проверить в backend">
                <ol style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
                  <li>
                    В DevTools проверить payload создания local server: отправляется ли serverToken
                  </li>
                  <li>
                    В DTO центрального сервера проверить поле{' '} serverToken
                  </li>
                  <li>
                    В service создания проверить:{' '} passwordEncoder.encode(request.getServerToken())
                  </li>
                  <li>
                    В entity проверить колонку:{' '} @Column(name = "server_token_hash")
                  </li>
                  <li>
                    В БД проверить, что server_token_hash не пустой.
                  </li>
                  <li>
                    Отправить heartbeat вручную через страницу debug.
                  </li>
                  <li>
                    Проверить, что last_seen_at обновился.
                  </li>
                  <li>
                    Проверить, что status = online
                  </li>
                </ol>
              </Card>

              <Card title="SQL для проверки">
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
{`SELECT
    id,
    object_id,
    name,
    status,
    ip_address,
    software_version,
    last_seen_at,
    server_token_hash
FROM local_servers
WHERE id = '${selected.id}';`}
                </pre>
              </Card>
            </>)}
        </>)}
    </div>);
}

function Info({ label, value }: { label: string; value: string }) {
  return (<div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px minmax(0, 1fr)',
        gap: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>);
}