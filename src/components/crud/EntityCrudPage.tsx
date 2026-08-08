import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Badge } from '../badges/Badge';
import { Button } from '../buttons/Button';
import { Card } from '../cards/Card';
import { ConfirmDialog } from '../confirm/ConfirmDialog';
import { ErrorMessage } from '../feedback/ErrorMessage';
import { Loading } from '../feedback/Loading';
import { Modal } from '../modal/Modal';
import { PageHeader } from '../page/PageHeader';
import { DataTable } from '../table/DataTable';

export interface EntityCrudColumn<TItem> {
  key: string;
  title: string;
  render: (item: TItem) => ReactNode;
}

interface EntityCrudPageProps<TItem extends { id: string }, TCreate, TUpdate> {
  title: string;
  description?: string;

  createTitle: string;
  listTitle: string;
  editTitle: string;
  deleteTitle: string;
  deleteDescription?: string;

  loadItems: () => Promise<TItem[]>;
  createItem: (request: TCreate) => Promise<unknown>;
  updateItem: (id: string, request: TUpdate) => Promise<unknown>;
  deleteItem: (id: string) => Promise<unknown>;

  initialCreateState: TCreate;
  createForm: (
    value: TCreate,
    setValue: (value: TCreate) => void,
  ) => ReactNode;

  toUpdateState: (item: TItem) => TUpdate;
  editForm: (
    value: TUpdate,
    setValue: (value: TUpdate) => void,
  ) => ReactNode;

  columns: EntityCrudColumn<TItem>[];
  getDeleteLabel?: (item: TItem) => string;
}

export function EntityCrudPage<TItem extends { id: string }, TCreate, TUpdate>({
  title,
  description,
  createTitle,
  listTitle,
  editTitle,
  deleteTitle,
  deleteDescription,

  loadItems,
  createItem,
  updateItem,
  deleteItem,

  initialCreateState,
  createForm,

  toUpdateState,
  editForm,

  columns,
  getDeleteLabel,
}: EntityCrudPageProps<TItem, TCreate, TUpdate>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [createState, setCreateState] = useState<TCreate>(initialCreateState);
  const [editState, setEditState] = useState<TUpdate | null>(null);
  const [editItem, setEditItem] = useState<TItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      setItems(await loadItems());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);

      await createItem(createState);

      setMessage('Запись создана');
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания записи');
    } finally {
      setActionLoading(false);
    }
  }

  function openEdit(item: TItem) {
    setEditItem(item);
    setEditState(toUpdateState(item));
    setMessage(null);
    setError(null);
  }

  function closeEdit() {
    setEditItem(null);
    setEditState(null);
  }

  async function handleUpdate(event?: FormEvent) {
    event?.preventDefault();

    if (!editItem || !editState) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);

      await updateItem(editItem.id, editState);

      setMessage('Запись обновлена');
      closeEdit();

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка обновления записи');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);

      await deleteItem(deleteTarget.id);

      setMessage('Запись удалена');
      setDeleteTarget(null);

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка удаления записи');
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
        title={title}
        description={description}
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {message && (
        <Card>
          <Badge tone="success">{message}</Badge>
        </Card>
      )}

      <Card title={createTitle}>
        <form className="ds-grid ds-grid-3" onSubmit={handleCreate}>
          {createForm(createState, setCreateState)}

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={actionLoading}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title={listTitle}>
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              ...columns,
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEdit(item)}
                    >
                      Изменить
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget(item)}
                    >
                      Удалить
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Modal
        open={Boolean(editItem && editState)}
        onClose={closeEdit}
        title={editTitle}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeEdit}
              disabled={actionLoading}
            >
              Отмена
            </Button>

            <Button onClick={handleUpdate} disabled={actionLoading}>
              {actionLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        {editState && (
          <form className="ds-grid" onSubmit={handleUpdate}>
            {editForm(editState, setEditState)}
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTitle}
        description={
          deleteDescription ||
          'Если запись связана с другими данными, backend может запретить удаление.'
        }
        confirmText="Удалить"
        danger
        loading={actionLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      >
        <div style={{ overflowWrap: 'anywhere' }}>
          {deleteTarget
            ? getDeleteLabel
              ? getDeleteLabel(deleteTarget)
              : deleteTarget.id
            : ''}
        </div>
      </ConfirmDialog>
    </div>
  );
}