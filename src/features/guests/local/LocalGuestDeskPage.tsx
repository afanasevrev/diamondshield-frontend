import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  checkInGuest,
  checkOutGuest,
  getGuests,
  type Guest,
} from '../api/guestApi';

export function LocalGuestDeskPage() {
  const [items, setItems] = useState<Guest[]>([]);
  const [query, setQuery] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getGuests());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки гостей');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(id: string) {
    try {
      setActionLoading(true);
      setError(null);

      await checkInGuest(id);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка регистрации входа');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut(id: string) {
    try {
      setActionLoading(true);
      setError(null);

      await checkOutGuest(id);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка регистрации выхода');
    } finally {
      setActionLoading(false);
    }
  }

  function handleQrSubmit(event: SubmitEvent) {
    event.preventDefault();

    const found = items.find((item) => item.qrValue === qrValue.trim());

    if (!found) {
      setError('Гость с таким QR не найден');
      return;
    }

    handleCheckIn(found.id);
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

  const filtered = items.filter((item) => {
    const text = `${item.lastName || ''} ${item.firstName || ''} ${
      item.middleName || ''
    } ${item.phone || ''} ${item.documentNumber || ''} ${item.qrValue || ''}`.toLowerCase();

    return text.includes(query.toLowerCase());
  });

  return (
    <div className="ds-page">
      <PageHeader
        title="Гостевой пост"
        description="Локальный интерфейс коменданта: поиск гостя, вход и выход"
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

      <div className="ds-grid ds-grid-2">
        <Card title="Поиск гостя">
          <Input
            label="ФИО, телефон, документ или QR"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите строку поиска"
          />
        </Card>

        <Card title="Сканирование QR">
          <form className="ds-grid" onSubmit={handleQrSubmit}>
            <Input
              label="QR value"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder="Вставьте QR value"
            />

            <Button type="submit" disabled={!qrValue || actionLoading}>
              Зарегистрировать вход
            </Button>
          </form>
        </Card>
      </div>

      <Card title="Гости">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={filtered}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'fio',
                title: 'Гость',
                render: (item) =>
                  `${item.lastName || ''} ${item.firstName || ''} ${item.middleName || ''}`,
              },
              {
                key: 'visit',
                title: 'Визит',
                render: (item) =>
                  `${item.visitDate || '—'} ${item.visitTimeFrom || ''}-${item.visitTimeTo || ''}`,
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={item.status === 'checked_in' ? 'success' : 'warning'}>
                    {item.status || '—'}
                  </Badge>
                ),
              },
              {
                key: 'in',
                title: 'Вход',
                render: (item) => formatDateTime(item.checkedInAt),
              },
              {
                key: 'out',
                title: 'Выход',
                render: (item) => formatDateTime(item.checkedOutAt),
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleCheckIn(item.id)}
                    >
                      Вход
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={actionLoading}
                      onClick={() => handleCheckOut(item.id)}
                    >
                      Выход
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}