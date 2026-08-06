import { type FormEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ConfirmDialog } from '../../../components/confirm/ConfirmDialog';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { Modal } from '../../../components/modal/Modal';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { useCrudActions } from '../../../shared/hooks/useCrudActions';
import {
  createOrganization,
  getOrganizations,
  type Organization,
} from '../api/centralApi';
import {
  deleteOrganization,
  updateOrganization,
} from '../api/crudCentralApi';

export function OrganizationsPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('ООО Тест');
  const [inn, setInn] = useState('7700000000');
  const [description, setDescription] = useState('Тестовая организация');

  const crud = useCrudActions<Organization>();

  const [editName, setEditName] = useState('');
  const [editInn, setEditInn] = useState('');
  const [editDescription, setEditDescription] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setItems(await getOrganizations());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки организаций');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createOrganization({
        name,
        inn,
        description,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания организации');
    }
  }

  function handleOpenEdit(item: Organization) {
    crud.openEdit(item);
    setEditName(item.name || '');
    setEditInn(item.inn || '');
    setEditDescription(item.description || '');
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();

    if (!crud.editItem) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await updateOrganization(crud.editItem.id, {
        name: editName,
        inn: editInn,
        description: editDescription,
      });

      crud.setActionMessage('Организация обновлена');
      crud.closeEdit();

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка обновления организации');
    } finally {
      crud.setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!crud.deleteItem) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await deleteOrganization(crud.deleteItem.id);

      crud.setActionMessage('Организация удалена');
      crud.closeDelete();

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка удаления организации');
    } finally {
      crud.setActionLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Организации"
        description="Управление организациями центрального сервера"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {crud.actionMessage && (
        <Card>
          <Badge tone="success">{crud.actionMessage}</Badge>
        </Card>
      )}

      <Card title="Создать организацию">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Input
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="ИНН"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
          />

          <TextArea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </Card>

      <Card title="Список организаций">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              { key: 'inn', title: 'ИНН', render: (item) => item.inn || '—' },
              {
                key: 'description',
                title: 'Описание',
                render: (item) => item.description || '—',
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenEdit(item)}
                    >
                      Изменить
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => crud.openDelete(item)}
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
        open={Boolean(crud.editItem)}
        onClose={crud.closeEdit}
        title="Редактировать организацию"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={crud.closeEdit}
              disabled={crud.actionLoading}
            >
              Отмена
            </Button>

            <Button onClick={handleUpdate} disabled={crud.actionLoading}>
              {crud.actionLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <form className="ds-grid" onSubmit={handleUpdate}>
          <Input
            label="Название"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <Input
            label="ИНН"
            value={editInn}
            onChange={(e) => setEditInn(e.target.value)}
          />

          <TextArea
            label="Описание"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(crud.deleteItem)}
        title="Удалить организацию?"
        description="Если организация связана с объектами или пользователями, backend может запретить удаление."
        confirmText="Удалить"
        danger
        loading={crud.actionLoading}
        onCancel={crud.closeDelete}
        onConfirm={handleDelete}
      >
        <div>
          Организация:{' '}
          <strong>{crud.deleteItem?.name || crud.deleteItem?.id}</strong>
        </div>
      </ConfirmDialog>
    </div>
  );
}