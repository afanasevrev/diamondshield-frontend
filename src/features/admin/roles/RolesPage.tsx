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
  assignRolePermissions,
  createRole,
  deleteRole,
  getPermissions,
  getRoles,
  type Permission,
  type Role,
  updateRole,
} from '../api/adminApi';

export function RolesPage() {
  const [items, setItems] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const crud = useCrudActions<Role>();

  const [code, setCode] = useState('OPERATOR');
  const [name, setName] = useState('Оператор');
  const [description, setDescription] = useState('Оператор объекта');

  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [permissionRole, setPermissionRole] = useState<Role | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextRoles, nextPermissions] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setItems(nextRoles);
      setPermissions(nextPermissions);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки ролей');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createRole({
        code,
        name,
        description,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания роли');
    }
  }

  function openEdit(item: Role) {
    crud.openEdit(item);
    setEditCode(item.code || '');
    setEditName(item.name || '');
    setEditDescription(item.description || '');
  }

  async function handleUpdate(event?: FormEvent) {
    event?.preventDefault();

    if (!crud.editItem) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await updateRole(crud.editItem.id, {
        code: editCode,
        name: editName,
        description: editDescription,
      });

      crud.closeEdit();
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка обновления роли');
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

      await deleteRole(crud.deleteItem.id);

      crud.closeDelete();
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка удаления роли');
    } finally {
      crud.setActionLoading(false);
    }
  }

  function openPermissions(item: Role) {
    setPermissionRole(item);

    const nextIds = permissions
      .filter((permission) =>
        item.permissions?.includes(permission.code) ||
        item.permissions?.includes(permission.id),
      )
      .map((permission) => permission.id);

    setSelectedPermissionIds(nextIds);
  }

  function togglePermission(id: string) {
    setSelectedPermissionIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  }

  async function handleAssignPermissions() {
    if (!permissionRole) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await assignRolePermissions(permissionRole.id, {
        permissionIds: selectedPermissionIds,
      });

      setPermissionRole(null);
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка назначения permissions');
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
        title="Роли"
        description="Роли пользователей и наборы прав"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать роль">
        <form className="ds-grid ds-grid-3" onSubmit={handleCreate}>
          <Input label="Код" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <TextArea label="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </Card>

      <Card title="Список ролей">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'code',
                title: 'Код',
                render: (item) => <Badge tone="info">{item.code}</Badge>,
              },
              { key: 'name', title: 'Название', render: (item) => item.name },
              {
                key: 'description',
                title: 'Описание',
                render: (item) => item.description || '—',
              },
              {
                key: 'permissions',
                title: 'Permissions',
                render: (item) => item.permissions?.length ?? 0,
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>
                      Изменить
                    </Button>

                    <Button size="sm" variant="secondary" onClick={() => openPermissions(item)}>
                      Права
                    </Button>

                    <Button size="sm" variant="danger" onClick={() => crud.openDelete(item)}>
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
        title="Редактировать роль"
        footer={
          <>
            <Button variant="secondary" onClick={crud.closeEdit}>
              Отмена
            </Button>

            <Button onClick={handleUpdate} disabled={crud.actionLoading}>
              Сохранить
            </Button>
          </>
        }
      >
        <form className="ds-grid" onSubmit={handleUpdate}>
          <Input label="Код" value={editCode} onChange={(e) => setEditCode(e.target.value)} />
          <Input label="Название" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <TextArea label="Описание" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
        </form>
      </Modal>

      <Modal
        open={Boolean(permissionRole)}
        onClose={() => setPermissionRole(null)}
        title="Назначить permissions"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPermissionRole(null)}>
              Отмена
            </Button>

            <Button onClick={handleAssignPermissions} disabled={crud.actionLoading}>
              Сохранить права
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 10 }}>
          {permissions.map((permission) => (
            <label
              key={permission.id}
              style={{
                display: 'flex',
                gap: 10,
                color: 'var(--ds-text-soft)',
              }}
            >
              <input
                type="checkbox"
                checked={selectedPermissionIds.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
              />

              <span>
                <strong>{permission.code}</strong> — {permission.name || permission.description || '—'}
              </span>
            </label>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(crud.deleteItem)}
        title="Удалить роль?"
        description="Удаление роли может быть запрещено, если она назначена пользователям."
        confirmText="Удалить"
        danger
        loading={crud.actionLoading}
        onCancel={crud.closeDelete}
        onConfirm={handleDelete}
      >
        <div>{crud.deleteItem?.code}</div>
      </ConfirmDialog>
    </div>
  );
}