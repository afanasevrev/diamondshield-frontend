import { StatusDot } from '../../../components/badges/StatusDot';
import { Input } from '../../../components/forms/Input';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  type Controller,
  createController,
  getControllers,
} from '../api/centralApi';
import { deleteController, updateController } from '../api/crudCentralApi';

interface ControllerForm {
  objectId: string;
  localServerId?: string;
  name: string;
  model: string;
  serialNumber?: string;
  ipAddress?: string;
  port?: number;
}

export function ControllersPage() {
  return (
    <EntityCrudPage<Controller, ControllerForm, ControllerForm>
      title="Контроллеры"
      description="Контроллеры доступа, включая несколько PERCo C01"
      createTitle="Создать контроллер"
      listTitle="Список контроллеров"
      editTitle="Редактировать контроллер"
      deleteTitle="Удалить контроллер?"
      loadItems={getControllers}
      createItem={createController}
      updateItem={updateController}
      deleteItem={deleteController}
      initialCreateState={{
        objectId: '',
        localServerId: '',
        name: 'PERCo C01 - Главный вход',
        model: 'PERCo C01',
        serialNumber: 'PERCO-C01-001',
        ipAddress: '192.168.1.20',
        port: 80,
      }}
      createForm={(value, setValue) => (
        <>
          <Input label="objectId" value={value.objectId || ''} onChange={(e) => setValue({ ...value, objectId: e.target.value })} />
          <Input label="localServerId" value={value.localServerId || ''} onChange={(e) => setValue({ ...value, localServerId: e.target.value })} />
          <Input label="Название" value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} />
          <Input label="Модель" value={value.model || ''} onChange={(e) => setValue({ ...value, model: e.target.value })} />
          <Input label="Серийный номер" value={value.serialNumber || ''} onChange={(e) => setValue({ ...value, serialNumber: e.target.value })} />
          <Input label="IP" value={value.ipAddress || ''} onChange={(e) => setValue({ ...value, ipAddress: e.target.value })} />
          <Input label="Порт" type="number" value={String(value.port || '')} onChange={(e) => setValue({ ...value, port: Number(e.target.value) })} />
        </>
      )}
      toUpdateState={(item) => ({
        objectId: item.objectId || '',
        localServerId: item.localServerId || '',
        name: item.name,
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        ipAddress: item.ipAddress || '',
        port: item.port || 80,
      })}
      editForm={(value, setValue) => (
        <>
          <Input label="objectId" value={value.objectId || ''} onChange={(e) => setValue({ ...value, objectId: e.target.value })} />
          <Input label="localServerId" value={value.localServerId || ''} onChange={(e) => setValue({ ...value, localServerId: e.target.value })} />
          <Input label="Название" value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} />
          <Input label="Модель" value={value.model || ''} onChange={(e) => setValue({ ...value, model: e.target.value })} />
          <Input label="Серийный номер" value={value.serialNumber || ''} onChange={(e) => setValue({ ...value, serialNumber: e.target.value })} />
          <Input label="IP" value={value.ipAddress || ''} onChange={(e) => setValue({ ...value, ipAddress: e.target.value })} />
          <Input label="Порт" type="number" value={String(value.port || '')} onChange={(e) => setValue({ ...value, port: Number(e.target.value) })} />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'name', title: 'Название', render: (item) => item.name },
        { key: 'model', title: 'Модель', render: (item) => item.model || '—' },
        {
          key: 'status',
          title: 'Статус',
          render: (item) => <StatusDot status={item.status || 'offline'} />,
        },
        { key: 'localServer', title: 'Local server', render: (item) => item.localServerId || '—' },
        { key: 'ip', title: 'IP:порт', render: (item) => `${item.ipAddress || '—'}${item.port ? `:${item.port}` : ''}` },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}