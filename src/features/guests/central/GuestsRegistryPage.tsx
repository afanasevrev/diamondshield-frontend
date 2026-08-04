import { useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Modal } from '../../../components/modal/Modal';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { getGuests, type Guest } from '../api/guestApi';

function statusTone(status?: string | null): 'success' | 'warning' | 'danger' | 'muted' {
  if (!status) {
    return 'muted';
  }

  const value = status.toLowerCase();

  if (value === 'active' || value === 'checked_in') {
    return 'success';
  }

  if (value === 'approved') {
    return 'warning';
  }

  if (value === 'expired' || value === 'blocked') {
    return 'danger';
  }

  return 'muted';
}

export function GuestsRegistryPage() {
  const [items, setItems] = useState<Guest[]>([]);
  const [selected, setSelected] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Реестр гостей"
        description="Согласованные гости, QR и статусы посещения"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Гости">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
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
                key: 'host',
                title: 'Принимающий',
                render: (item) => item.hostPersonFullName || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={statusTone(item.status)}>{item.status || '—'}</Badge>
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
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelected(item)}
                  >
                    Карточка
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Карточка гостя"
        footer={
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Закрыть
          </Button>
        }
      >
        {selected && (
          <div style={{ display: 'grid', gap: 10 }}>
            <Info label="ID" value={selected.id} />
            <Info
              label="ФИО"
              value={`${selected.lastName || ''} ${selected.firstName || ''} ${
                selected.middleName || ''
              }`}
            />
            <Info label="Телефон" value={selected.phone || '—'} />
            <Info
              label="Документ"
              value={`${selected.documentType || '—'} ${selected.documentSeries || ''} ${
                selected.documentNumber || ''
              }`}
            />
            <Info label="Визит" value={`${selected.visitDate || '—'}`} />
            <Info label="Статус" value={selected.status || '—'} />
            <Info label="QR" value={selected.qrValue || '—'} />
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '130px minmax(0, 1fr)',
        gap: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>
  );
}