import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { TextArea } from '../../../components/forms/TextArea';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import { createObject, type DsObject, getObjects } from '../api/centralApi';
import { deleteObject, updateObject } from '../api/crudCentralApi';

interface ObjectForm {
  organizationId: string;
  name: string;
  address?: string;
  timezone?: string;
  description?: string;
}

export function ObjectsPage() {
  return (
    <EntityCrudPage<DsObject, ObjectForm, ObjectForm>
      title="Объекты"
      description="Объекты охраны и площадки"
      createTitle="Создать объект"
      listTitle="Список объектов"
      editTitle="Редактировать объект"
      deleteTitle="Удалить объект?"
      loadItems={getObjects}
      createItem={createObject}
      updateItem={updateObject}
      deleteItem={deleteObject}
      initialCreateState={{
        organizationId: '',
        name: 'Главный объект',
        address: 'г. Москва',
        timezone: 'Asia/Tokyo',
        description: 'Тестовый объект',
      }}
      createForm={(value, setValue) => (
        <>
          <Input
            label="organizationId"
            value={value.organizationId || ''}
            onChange={(e) =>
              setValue({ ...value, organizationId: e.target.value })
            }
          />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="Адрес"
            value={value.address || ''}
            onChange={(e) => setValue({ ...value, address: e.target.value })}
          />

          <Select
            label="Timezone"
            value={value.timezone || 'Asia/Tokyo'}
            onChange={(e) => setValue({ ...value, timezone: e.target.value })}
            options={[
              { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
              { label: 'Asia/Vladivostok', value: 'Asia/Vladivostok' },
              { label: 'Europe/Moscow', value: 'Europe/Moscow' },
            ]}
          />

          <TextArea
            label="Описание"
            value={value.description || ''}
            onChange={(e) =>
              setValue({ ...value, description: e.target.value })
            }
          />
        </>
      )}
      toUpdateState={(item) => ({
        organizationId: item.organizationId || '',
        name: item.name,
        address: item.address || '',
        timezone: item.timezone || 'Asia/Tokyo',
        description: item.description || '',
      })}
      editForm={(value, setValue) => (
        <>
          <Input
            label="organizationId"
            value={value.organizationId || ''}
            onChange={(e) =>
              setValue({ ...value, organizationId: e.target.value })
            }
          />

          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="Адрес"
            value={value.address || ''}
            onChange={(e) => setValue({ ...value, address: e.target.value })}
          />

          <Select
            label="Timezone"
            value={value.timezone || 'Asia/Tokyo'}
            onChange={(e) => setValue({ ...value, timezone: e.target.value })}
            options={[
              { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
              { label: 'Asia/Vladivostok', value: 'Asia/Vladivostok' },
              { label: 'Europe/Moscow', value: 'Europe/Moscow' },
            ]}
          />

          <TextArea
            label="Описание"
            value={value.description || ''}
            onChange={(e) =>
              setValue({ ...value, description: e.target.value })
            }
          />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'name', title: 'Название', render: (item) => item.name },
        { key: 'org', title: 'Организация', render: (item) => item.organizationId || '—' },
        { key: 'address', title: 'Адрес', render: (item) => item.address || '—' },
        { key: 'tz', title: 'Timezone', render: (item) => item.timezone || '—' },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}