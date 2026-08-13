import { StatusDot } from '../../../components/badges/StatusDot';
import { Input } from '../../../components/forms/Input';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  createLocalServer,
  getLocalServers,
  type LocalServer,
} from '../api/centralApi';
import {
  deleteLocalServer,
  updateLocalServer,
} from '../api/crudCentralApi';

interface LocalServerForm {
  objectId: string;
  name: string;
  ipAddress?: string;
  macAddress?: string;
  softwareVersion?: string;
  serverToken: string;
}

export function LocalServersPage() {
  return (
    <EntityCrudPage<LocalServer, LocalServerForm, LocalServerForm>
      title="Локальные серверы"
      description="Локальные серверы объектов, heartbeat и online/offline"
      createTitle="Создать локальный сервер"
      listTitle="Список локальных серверов"
      editTitle="Редактировать локальный сервер"
      deleteTitle="Удалить локальный сервер?"
      deleteDescription="Удаление может быть запрещено, если сервер связан с контроллерами."
      loadItems={getLocalServers}
      createItem={createLocalServer}
      updateItem={updateLocalServer}
      deleteItem={deleteLocalServer}
      initialCreateState={{
        objectId: '',
        name: 'Локальный сервер объекта',
        ipAddress: '127.0.0.1',
        macAddress: '',
        softwareVersion: '1.0.0',
        serverToken: 'local-server-token-123',
      }}
      createForm={(value, setValue) => (
        <>
          <Input
            label="objectId"
            value={value.objectId || ''}
            onChange={(e) => setValue({ ...value, objectId: e.target.value })}
          />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="IP"
            value={value.ipAddress || ''}
            onChange={(e) => setValue({ ...value, ipAddress: e.target.value })}
          />

          <Input
            label="MAC"
            value={value.macAddress || ''}
            onChange={(e) => setValue({ ...value, macAddress: e.target.value })}
          />

          <Input
            label="Версия ПО"
            value={value.softwareVersion || ''}
            onChange={(e) =>
              setValue({ ...value, softwareVersion: e.target.value })
            }
          />

          <Input
            label="serverToken"
            value={value.serverToken || ''}
            onChange={(e) =>
              setValue({ ...value, serverToken: e.target.value })
            }
          />
        </>
      )}
      toUpdateState={(item) => ({
        objectId: item.objectId || '',
        name: item.name,
        ipAddress: item.ipAddress || '',
        macAddress: item.macAddress || '',
        softwareVersion: item.softwareVersion || '',
        serverToken: item.serverToken || '',
      })}
      editForm={(value, setValue) => (
        <>
          <Input
            label="objectId"
            value={value.objectId || ''}
            onChange={(e) => setValue({ ...value, objectId: e.target.value })}
          />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="IP"
            value={value.ipAddress || ''}
            onChange={(e) => setValue({ ...value, ipAddress: e.target.value })}
          />

          <Input
            label="MAC"
            value={value.macAddress || ''}
            onChange={(e) => setValue({ ...value, macAddress: e.target.value })}
          />

          <Input
            label="Версия ПО"
            value={value.softwareVersion || ''}
            onChange={(e) =>
              setValue({ ...value, softwareVersion: e.target.value })
            }
          />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'name', title: 'Название', render: (item) => item.name },
        {
          key: 'status',
          title: 'Статус',
          render: (item) => <StatusDot status={item.status || 'offline'} />,
        },
        { key: 'object', title: 'Object', render: (item) => item.objectId || '—' },
        { key: 'ip', title: 'IP', render: (item) => item.ipAddress || '—' },
        { key: 'version', title: 'Версия', render: (item) => item.softwareVersion || '—' },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}