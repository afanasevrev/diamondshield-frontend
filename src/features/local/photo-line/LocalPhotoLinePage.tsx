import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { getLocalAccessEvents, type LocalAccessEvent } from '../api/localArmApi';

export function LocalPhotoLinePage() {
  const [items, setItems] = useState<LocalAccessEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const response = await getLocalAccessEvents();

      setItems(response.slice(0, 12));
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки фоторяда');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(load, 5000);

    return () => window.clearInterval(timer);
  }, [autoRefresh]);

  return (
    <div className="ds-page">
      <PageHeader
        title="Фоторяд"
        description="Последние проходы пользователей на объекте"
        actions={
          <>
            <Button variant="secondary" onClick={load}>
              Обновить
            </Button>

            <Button
              variant={autoRefresh ? 'primary' : 'secondary'}
              onClick={() => setAutoRefresh((value) => !value)}
            >
              Auto refresh: {autoRefresh ? 'on' : 'off'}
            </Button>
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loading />
      ) : (
        <div className="ds-grid ds-grid-3">
          {items.map((item) => {
            const result = item.accessResult || item.eventResult || '—';
            const isAllowed = result === 'allowed';
            const isUnknown = Boolean(item.unknownIdentifier);

            return (
              <Card key={item.id}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div
                    style={{
                      height: 160,
                      borderRadius: 16,
                      background:
                        'linear-gradient(135deg, rgba(55,183,255,0.18), rgba(5,14,26,0.9))',
                      border: '1px solid var(--ds-border)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--ds-text-muted)',
                      fontWeight: 800,
                      fontSize: 36,
                    }}
                  >
                    {isUnknown ? '?' : '👤'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {item.personFullName ||
                        item.personId ||
                        'Неизвестный пользователь'}
                    </div>

                    <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                      {formatDateTime(item.eventTime || item.createdAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Badge tone={isAllowed ? 'success' : 'danger'}>
                      {result}
                    </Badge>

                    {isUnknown && <Badge tone="danger">unknown</Badge>}

                    <Badge tone="muted">
                      {item.identifierMasked ||
                        item.unknownIdentifier ||
                        item.identifierId ||
                        '—'}
                    </Badge>
                  </div>

                  <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                    Точка: {item.accessPointId || '—'}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}