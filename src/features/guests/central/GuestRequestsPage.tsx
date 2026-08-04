import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { TextArea } from '../../../components/forms/TextArea';
import { Modal } from '../../../components/modal/Modal';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  approveGuestRequest,
  getGuestRequests,
  type GuestRequest,
  rejectGuestRequest,
} from '../api/guestApi';

function statusTone(status?: string | null): 'success' | 'warning' | 'danger' | 'muted' {
  if (!status) {
    return 'muted';
  }

  const value = status.toLowerCase();

  if (value === 'approved') {
    return 'success';
  }

  if (value === 'pending' || value === 'new') {
    return 'warning';
  }

  if (value === 'rejected') {
    return 'danger';
  }

  return 'muted';
}

export function GuestRequestsPage() {
  const [items, setItems] = useState<GuestRequest[]>([]);
  const [selected, setSelected] = useState<GuestRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<GuestRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Отказано службой безопасности');
  const [qrValue, setQrValue] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await getGuestRequests());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки гостевых заявок');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      setActionLoading(true);
      setError(null);
      setQrValue('');

      const response = await approveGuestRequest(id);

      if (response.qrValue) {
        setQrValue(response.qrValue);
      }

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка согласования заявки');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(event: SubmitEvent) {
    event.preventDefault();

    if (!rejectTarget) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      await rejectGuestRequest(rejectTarget.id, {
        reason: rejectReason,
      });

      setRejectTarget(null);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка отклонения заявки');
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
        title="Гостевые заявки"
        description="Согласование и отклонение заявок на посещение"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {qrValue && (
        <Card title="QR / гостевой идентификатор создан">
          <div style={{ display: 'grid', gap: 12 }}>
            <Badge tone="success">approved</Badge>
            <code style={{ color: 'var(--ds-primary)', overflowWrap: 'anywhere' }}> </code>
              {qrValue}
            </div>
        </Card>)}

      <Card title="Реестр заявок">
        {loading? (<Loading />): (<DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'created',
                title: 'Создана',
                render: (item) => formatDateTime(item.createdAt),
              },
              {
                key: 'fio',
                title: 'Гость',
                render: (item) =>
                  `item.lastName∣∣′′item.lastName∣∣ ′′{item.firstName || ''} ${item.middleName || ''}`,
              },
              {
                key: 'visit',
                title: 'Визит',
                render: (item) =>
                  `item.visitDate∣∣′—′item.visitDate∣∣ ′— ′{item.visitTimeFrom || ''}-${item.visitTimeTo || ''}`,
              },
              {
                key: 'host',
                title: 'Принимающий',
                render: (item) => item.hostPersonFullName || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (<Badge tone={statusTone(item.status)}>{item.status || '—'}</Badge>),
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelected(item)}
                    >
                      Открыть
                    </Button>

                    <Button
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleApprove(item.id)}
                    >
                      Согласовать
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      disabled={actionLoading}
                      onClick={() => setRejectTarget(item)}
                    >
                      Отклонить
                    </Button>
                  </div>),
              },
            ]}
          />)}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Гостевая заявка"
        footer={
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Закрыть
          </Button>
        }
      >
        {selected && (<div style={{ display: 'grid', gap: 10 }}>
            <Info label="ID" value={selected.id} />
            <Info
              label="ФИО"
              value={`selected.lastName∣∣′′selected.lastName∣∣′′{selected.firstName || ''} ${
                selected.middleName || ''
              }`}
            />
            <Info label="Телефон" value={selected.phone || '—'} />
            <Info label="Email" value={selected.email || '—'} />
            <Info
              label="Документ"
              value={`selected.documentType∣∣′—′selected.documentType∣∣ ′— ′{selected.documentSeries || ''} ${
                selected.documentNumber || ''
              }`}
            />
            <Info label="Дата визита" value={selected.visitDate || '—'} />
            <Info
              label="Время"
              value={`selected.visitTimeFrom∣∣′—′−selected.visitTimeFrom∣∣ ′— ′−{selected.visitTimeTo || '—'}`}
            />
            <Info label="Цель" value={selected.purpose || '—'} />
            <Info label="Статус" value={selected.status || '—'} />
          </div>)}
      </Modal>

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Отклонить заявку"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectTarget(null)}>
              Отмена
            </Button>

            <Button variant="danger" disabled={actionLoading} type="submit">
              Отклонить
            </Button>
          </>
        }
      >
        <form onSubmit={handleReject}>
          <TextArea
            label="Причина отказа"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </form>
      </Modal>
    </div>);
}

function Info({ label, value }: { label: string; value: string }) {
  return (<div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px minmax(0, 1fr)',
        gap: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>);
}