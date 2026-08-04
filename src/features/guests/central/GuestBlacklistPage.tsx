import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  createGuestBlacklistItem,
  deleteGuestBlacklistItem,
  getGuestBlacklist,
  type GuestBlacklistItem,
} from '../api/guestApi';

export function GuestBlacklistPage() {
  const [items, setItems] = useState<GuestBlacklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lastName, setLastName] = useState('Сидоров');
  const [firstName, setFirstName] = useState('Сидор');
  const [middleName, setMiddleName] = useState('Сидорович');
  const [documentType, setDocumentType] = useState('passport');
  const [documentSeries, setDocumentSeries] = useState('4502');
  const [documentNumber, setDocumentNumber] = useState('000111');
  const [phone, setPhone] = useState('+79998887766');
  const [reason, setReason] = useState('Нарушение правил посещения');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getGuestBlacklist());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки blacklist');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError(null);

      await createGuestBlacklistItem({
        lastName,
        firstName,
        middleName,
        documentType,
        documentSeries,
        documentNumber,
        phone,
        reason,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка добавления в blacklist');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setActionLoading(true);
      setError(null);

      await deleteGuestBlacklistItem(id);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка удаления из blacklist');
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Нежелательные гости"
        description="Blacklist посетителей и запрет автоматического согласования"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Добавить в blacklist">
        <form className="ds-grid ds-grid-3" onSubmit={handleCreate}>
          <Input label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Отчество" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />

          <Input label="Тип документа" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
          <Input label="Серия" value={documentSeries} onChange={(e) => setDocumentSeries(e.target.value)} />
          <Input label="Номер" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />

          <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <TextArea label="Причина" value={reason} onChange={(e) => setReason(e.target.value)} />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={actionLoading}>
              Добавить
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Blacklist">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'fio',
                title: 'ФИО',
                render: (item) =>
                  `${item.lastName || ''} ${item.firstName || ''} ${item.middleName || ''}`,
              },
              {
                key: 'document',
                title: 'Документ',
                render: (item) =>
                  `${item.documentType || '—'} ${item.documentSeries || ''} ${
                    item.documentNumber || ''
                  }`,
              },
              {
                key: 'phone',
                title: 'Телефон',
                render: (item) => item.phone || '—',
              },
              {
                key: 'reason',
                title: 'Причина',
                render: (item) => item.reason || '—',
              },
              {
                key: 'active',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={item.active === false ? 'muted' : 'danger'}>
                    {item.active === false ? 'inactive' : 'active'}
                  </Badge>
                ),
              },
              {
                key: 'created',
                title: 'Создан',
                render: (item) => formatDateTime(item.createdAt),
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={actionLoading}
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}