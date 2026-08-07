import { type FormEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ConfirmDialog } from '../../../components/confirm/ConfirmDialog';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { Modal } from '../../../components/modal/Modal';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { useCrudActions } from '../../../shared/hooks/useCrudActions';
import {
  assignUserRoles,
  createUser,
  deleteUser,
  getRoles,
  getUsers,
  type Role,
  updateUser,
  type User,
} from '../api/adminApi';

export function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const crud = useCrudActions<User>();

  const [username, setUsername] = useState('operator');
  const [password, setPassword] = useState('operator');
  const [displayName, setDisplayName] = useState('Оператор');
  const [email, setEmail] = useState('operator@example.com');

  const [editUsername, setEditUsername] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editEnabled, setEditEnabled] = useState('true');

  const [roleUser, setRoleUser] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextUsers, nextRoles] = await Promise.all([
        getUsers(),
        getRoles(),
      ]);

      setItems(nextUsers);
      setRoles(nextRoles);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createUser({
        username,
        password,
        displayName,
        email,
        enabled: true,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания пользователя');
    }
  }

  function openEdit(item: User) {
    crud.openEdit(item);
    setEditUsername(item.username || '');
    setEditDisplayName(item.displayName || '');
    setEditEmail(item.email || '');
    setEditEnabled(item.enabled === false || item.active === false ? 'false' : 'true');
  }

  async function handleUpdate(event?: FormEvent) {
    event?.preventDefault();

    if (!crud.editItem) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await updateUser(crud.editItem.id, {
        username: editUsername,
        displayName: editDisplayName,
        email: editEmail,
        enabled: editEnabled === 'true',
      });

      crud.closeEdit();
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка обновления пользователя');
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

      await deleteUser(crud.deleteItem.id);

      crud.closeDelete();
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка удаления пользователя');
    } finally {
      crud.setActionLoading(false);
    }
  }

  function openRoles(item: User) {
    setRoleUser(item);

    const nextRoleIds = roles
      .filter((role) => item.roles?.includes(role.code) || item.roles?.includes(role.id))
      .map((role) => role.id);

    setSelectedRoleIds(nextRoleIds);
  }

  function toggleRole(roleId: string) {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  }

  async function handleAssignRoles() {
    if (!roleUser) {
      return;
    }

    try {
      crud.setActionLoading(true);
      setError(null);

      await assignUserRoles(roleUser.id, {
        roleIds: selectedRoleIds,
      });

      setRoleUser(null);
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка назначения ролей');
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
        title="Пользователи"
        description="Учетные записи центрального сервера"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать пользователя">
        <form className="ds-grid ds-grid-3" onSubmit={handleCreate}>
          <Input label="Логин" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Имя" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </Card>

      <Card title="Список пользователей">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'username', title: 'Логин', render: (item) => item.username },
              { key: 'name', title: 'Имя', render: (item) => item.displayName || '—' },
              { key: 'email', title: 'Email', render: (item) => item.email || '—' },
              {
                key: 'enabled',
                title: 'Активен',
                render: (item) => (
                  <Badge tone={item.enabled === false || item.active === false ? 'danger' : 'success'}>
                    {item.enabled === false || item.active === false ? 'no' : 'yes'}
                  </Badge>
                ),
              },
              {
                key: 'roles',
                title: 'Роли',
                render: (item) => item.roles?.join(', ') || '—',
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>
                      Изменить
                    </Button>

                    <Button size="sm" variant="secondary" onClick={() => openRoles(item)}>
                      Роли
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
        title="Редактировать пользователя"
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
          <Input label="Логин" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
          <Input label="Имя" value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} />
          <Input label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />

          <Select
            label="Активен"
            value={editEnabled}
            onChange={(e) => setEditEnabled(e.target.value)}
            options={[
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ]}
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(roleUser)}
        onClose={() => setRoleUser(null)}
        title="Назначить роли"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleUser(null)}>
              Отмена
            </Button>
            <Button onClick={handleAssignRoles} disabled={crud.actionLoading}>
              Сохранить роли
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 10 }}>
          {roles.map((role) => (
            <label
              key={role.id}
              style={{
                display: 'flex',
                gap: 10,
                color: 'var(--ds-text-soft)',
              }}
            >
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
              <span>
                <strong>{role.code}</strong> — {role.name}
              </span>
            </label>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(crud.deleteItem)}
        title="Удалить пользователя?"
        description="Лучше использовать soft delete или enabled=false."
        confirmText="Удалить"
        danger
        loading={crud.actionLoading}
        onCancel={crud.closeDelete}
        onConfirm={handleDelete}
      >
        <div>{crud.deleteItem?.username}</div>
      </ConfirmDialog>
    </div>
  );
}