import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { type AccessEvent, getAccessEvents } from '../api/centralApi';

export function AccessEventsPage() {
  const [items, setItems] = useState<AccessEvent[]>([]);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextUnknownOnly = unknownOnly) {
    try {
      setLoading(true);
      setError(null);

      setItems(await getAccessEvents(nextUnknownOnly));
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки событий доступа');
    } finally {
      setLoading(false);
    }
  }

  function toggleUnknownOnly() {
    const next = !unknownOnly;
    setUnknownOnly(next);
    load(next);
  }

  useEffect(() => {
    load(false);
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Журнал событий доступа"
        description="События allowed, denied и unknown_identifier"
        actions={
          <>
            <Button variant="secondary" onClick={() => load()}>
              Обновить
            </Button>

            <Button
              variant={unknownOnly ? 'primary' : 'secondary'}
              onClick={toggleUnknownOnly}
            >
              Только неизвестные
            </Button>
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="События">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'time',
                title: 'Время',
                render: (item) => formatDateTime(item.eventTime || item.createdAt),
              },
              {
                key: 'result',
                title: 'Результат',
                render: (item) => {
                  const result = item.eventResult || item.accessResult || '—';

                  return (
                    <Badge tone={result === 'allowed' ? 'success' : 'danger'}>
                      {result}
                    </Badge>
                  );
                },
              },
              {
                key: 'reason',
                title: 'Причина',
                render: (item) => item.denyReason || item.reason || '—',
              },
              {
                key: 'person',
                title: 'Пользователь',
                render: (item) =>
                  item.personFullName || item.personId || 'Неизвестный пользователь',
              },
              {
                key: 'identifier',
                title: 'Идентификатор',
                render: (item) =>
                  item.identifierMasked ||
                  item.unknownIdentifier ||
                  item.identifierId ||
                  '—',
              },
              {
                key: 'direction',
                title: 'Направление',
                render: (item) => item.direction || '—',
              },
              {
                key: 'point',
                title: 'Точка',
                render: (item) => item.accessPointId || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}