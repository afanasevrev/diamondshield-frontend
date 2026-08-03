import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  getLocalAccessEvents,
  getLocalUnknownAccessEvents,
  type LocalAccessEvent,
} from '../api/localArmApi';

export function LocalAccessEventsPage() {
  const [items, setItems] = useState<LocalAccessEvent[]>([]);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(nextUnknownOnly = unknownOnly) {
    try {
      setLoading(true);
      setError(null);

      const response = nextUnknownOnly
        ? await getLocalUnknownAccessEvents()
        : await getLocalAccessEvents();

      setItems(response);
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка загрузки локального журнала проходов',
      );
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

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(() => {
      load(unknownOnly);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [autoRefresh, unknownOnly]);

  return (
    <div className="ds-page">
      <PageHeader
        title="Журнал проходов объекта"
        description="Локальные события прохода, включая неизвестные идентификаторы"
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

      <Card title="События прохода">
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
                  const result = item.accessResult || item.eventResult || '—';

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
                render: (item) => item.reason || item.denyReason || '—',
              },
              {
                key: 'person',
                title: 'Пользователь',
                render: (item) =>
                  item.personFullName ||
                  item.personId ||
                  'Неизвестный пользователь',
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
                key: 'unknown',
                title: 'Unknown',
                render: (item) =>
                  item.isUnknownIdentifier || item.unknownIdentifier ? (
                    <Badge tone="danger">unknown</Badge>
                  ) : (
                    <Badge tone="muted">no</Badge>
                  ),
              },
              {
                key: 'direction',
                title: 'Направление',
                render: (item) => item.direction || '—',
              },
              {
                key: 'reader',
                title: 'Reader',
                render: (item) => item.readerId || '—',
              },
              {
                key: 'controller',
                title: 'Controller',
                render: (item) => item.controllerId || '—',
              },
              {
                key: 'sync',
                title: 'Синхр.',
                render: (item) =>
                  item.sentToCentral || item.isSynced ? (
                    <Badge tone="success">sent</Badge>
                  ) : (
                    <Badge tone="warning">new</Badge>
                  ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}