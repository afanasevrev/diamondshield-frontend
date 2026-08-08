import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  createOrganization,
  getOrganizations,
  type Organization,
} from '../api/centralApi';
import {
  deleteOrganization,
  updateOrganization,
} from '../api/crudCentralApi';

interface OrganizationForm {
  name: string;
  inn?: string;
  description?: string;
}

export function OrganizationsPage() {
  return (
    <EntityCrudPage<Organization, OrganizationForm, OrganizationForm>
      title="Организации"
      description="Создание, изменение и удаление организаций"
      createTitle="Создать организацию"
      listTitle="Список организаций"
      editTitle="Редактировать организацию"
      deleteTitle="Удалить организацию?"
      loadItems={getOrganizations}
      createItem={createOrganization}
      updateItem={updateOrganization}
      deleteItem={deleteOrganization}
      initialCreateState={{
        name: 'ООО Тест',
        inn: '7700000000',
        description: 'Тестовая организация',
      }}
      createForm={(value, setValue) => (
        <>
          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="ИНН"
            value={value.inn || ''}
            onChange={(e) => setValue({ ...value, inn: e.target.value })}
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
        name: item.name,
        inn: item.inn || '',
        description: item.description || '',
      })}
      editForm={(value, setValue) => (
        <>
          <Input
            label="Название"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <Input
            label="ИНН"
            value={value.inn || ''}
            onChange={(e) => setValue({ ...value, inn: e.target.value })}
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
        { key: 'inn', title: 'ИНН', render: (item) => item.inn || '—' },
        {
          key: 'description',
          title: 'Описание',
          render: (item) => item.description || '—',
        },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}