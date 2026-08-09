import { StatusDot } from '../../../components/badges/StatusDot';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  type AccessPoint,
  createAccessPoint,
  getAccessPoints,
} from '../api/centralApi';
import {
  deleteAccessPoint,
  updateAccessPoint,
} from '../api/crudCentralApi';

interface AccessPointForm {
  objectId: string;
  controllerId?: string;
  name: string;
  accessPointType: string;
  active: boolean;
}

export function AccessPointsPage() {
  return (
    <EntityCrudPage<AccessPoint, AccessPointForm, AccessPointForm>
      title="Точки прохода"
      description="Двери, турникеты и шлагбаумы"
      createTitle="Создать точку прохода"
      listTitle="Список точек прохода"
      editTitle="Редактировать точку прохода"
      deleteTitle="Удалить точку прохода?"
      loadItems={getAccessPoints}
      createItem={createAccessPoint}
      updateItem={updateAccessPoint}
      deleteItem={deleteAccessPoint}
      initialCreateState={{
        objectId: '',
        controllerId: '',
        name: 'Главный вход',
        accessPointType: 'door',
        active: true,
      }}
      createForm={(value, setValue) => (
        <>
          <Input label="objectId" value={value.objectId || ''} onChange={(e) => setValue({ ...value, objectId: e.target.value })} />
          <Input label="controllerId" value={value.controllerId || ''} onChange={(e) => setValue({ ...value, controllerId: e.target.value })} />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Select
            label="Тип"
            value={value.accessPointType}
            onChange={(e) =>
              setValue({ ...value, accessPointType: e.target.value })
            }
            options={[
              { label: 'Дверь', value: 'door' },
              { label: 'Турникет', value: 'turnstile' },
              { label: 'Шлагбаум', value: 'gate' },
            ]}
          />
        </>
      )}
      toUpdateState={(item) => ({
        objectId: item.objectId || '',
        controllerId: item.controllerId || '',
        name: item.name,
        accessPointType: item.accessPointType || 'door',
        active: item.active ?? true,
      })}
      editForm={(value, setValue) => (
        <>
          <Input label="objectId" value={value.objectId || ''} onChange={(e) => setValue({ ...value, objectId: e.target.value })} />
          <Input label="controllerId" value={value.controllerId || ''} onChange={(e) => setValue({ ...value, controllerId: e.target.value })} />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Select
            label="Тип"
            value={value.accessPointType}
            onChange={(e) =>
              setValue({ ...value, accessPointType: e.target.value })
            }
            options={[
              { label: 'Дверь', value: 'door' },
              { label: 'Турникет', value: 'turnstile' },
              { label: 'Шлагбаум', value: 'gate' },
            ]}
          />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'name', title: 'Название', render: (item) => item.name },
        { key: 'type', title: 'Тип', render: (item) => item.accessPointType || '—' },
        { key: 'object', title: 'Объект', render: (item) => item.objectId || '—' },
        { key: 'controller', title: 'Контроллер', render: (item) => item.controllerId || '—' },
        {
          key: 'status',
          title: 'Статус',
          render: (item) => <StatusDot status={item.status || 'active'} />,
        },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}