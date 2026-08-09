import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import { createPerson, getPersons, type Person } from '../api/centralApi';
import { deletePerson, updatePerson } from '../api/crudCentralApi';

interface PersonForm {
  organizationId: string;
  personType: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  personnelNumber?: string;
  phone?: string;
  email?: string;
  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;
  active?: boolean;
}

export function PersonsPage() {
  return (
    <EntityCrudPage<Person, PersonForm, PersonForm>
      title="Физические лица"
      description="Сотрудники, посетители и пользователи доступа"
      createTitle="Создать физическое лицо"
      listTitle="Список физических лиц"
      editTitle="Редактировать физическое лицо"
      deleteTitle="Удалить физическое лицо?"
      deleteDescription="Рекомендуется soft delete, потому что лицо может быть связано с событиями доступа."
      loadItems={getPersons}
      createItem={createPerson}
      updateItem={updatePerson}
      deleteItem={deletePerson}
      initialCreateState={{
        organizationId: 'ООО Тест',
        personType: 'employee',
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович',
        personnelNumber: 'EMP-001',
        phone: '+79990000000',
        email: 'ivanov@example.com',
        documentType: 'passport',
        documentSeries: '4500',
        documentNumber: '123456',
        active: true,
      }}
      createForm={(value, setValue) => (
        <>
          <Select
            label="Тип"
            value={value.personType || 'employee'}
            onChange={(e) => setValue({ ...value, personType: e.target.value })}
            options={[
              { label: 'Сотрудник', value: 'employee' },
              { label: 'Гость', value: 'guest' },
              { label: 'Подрядчик', value: 'contractor' },
            ]}
          />

          <Input label="Фамилия" value={value.lastName} onChange={(e) => setValue({ ...value, lastName: e.target.value })} />
          <Input label="Имя" value={value.firstName} onChange={(e) => setValue({ ...value, firstName: e.target.value })} />
          <Input label="Отчество" value={value.middleName || ''} onChange={(e) => setValue({ ...value, middleName: e.target.value })} />
          <Input label="Табельный" value={value.personnelNumber || ''} onChange={(e) => setValue({ ...value, personnelNumber: e.target.value })} />
          <Input label="Телефон" value={value.phone || ''} onChange={(e) => setValue({ ...value, phone: e.target.value })} />
          <Input label="Email" value={value.email || ''} onChange={(e) => setValue({ ...value, email: e.target.value })} />
          <Input label="Тип документа" value={value.documentType || ''} onChange={(e) => setValue({ ...value, documentType: e.target.value })} />
          <Input label="Серия" value={value.documentSeries || ''} onChange={(e) => setValue({ ...value, documentSeries: e.target.value })} />
          <Input label="Номер" value={value.documentNumber || ''} onChange={(e) => setValue({ ...value, documentNumber: e.target.value })} />
        </>
      )}
      toUpdateState={(item) => ({
        organizationId: item.organizationId || '',
        personType: item.personType || 'employee',
        lastName: item.lastName || '',
        firstName: item.firstName || '',
        middleName: item.middleName || '',
        personnelNumber: item.personnelNumber || '',
        phone: item.phone || '',
        email: item.email || '',
        documentType: item.documentType || '',
        documentSeries: item.documentSeries || '',
        documentNumber: item.documentNumber || '',
        active: item.active ?? true,
      })}
      editForm={(value, setValue) => (
        <>
          <Select
            label="Тип"
            value={value.personType || 'employee'}
            onChange={(e) => setValue({ ...value, personType: e.target.value })}
            options={[
              { label: 'Сотрудник', value: 'employee' },
              { label: 'Гость', value: 'guest' },
              { label: 'Подрядчик', value: 'contractor' },
            ]}
          />

          <Input label="Фамилия" value={value.lastName} onChange={(e) => setValue({ ...value, lastName: e.target.value })} />
          <Input label="Имя" value={value.firstName} onChange={(e) => setValue({ ...value, firstName: e.target.value })} />
          <Input label="Отчество" value={value.middleName || ''} onChange={(e) => setValue({ ...value, middleName: e.target.value })} />
          <Input label="Табельный" value={value.personnelNumber || ''} onChange={(e) => setValue({ ...value, personnelNumber: e.target.value })} />
          <Input label="Телефон" value={value.phone || ''} onChange={(e) => setValue({ ...value, phone: e.target.value })} />
          <Input label="Email" value={value.email || ''} onChange={(e) => setValue({ ...value, email: e.target.value })} />
          <Input label="Тип документа" value={value.documentType || ''} onChange={(e) => setValue({ ...value, documentType: e.target.value })} />
          <Input label="Серия" value={value.documentSeries || ''} onChange={(e) => setValue({ ...value, documentSeries: e.target.value })} />
          <Input label="Номер" value={value.documentNumber || ''} onChange={(e) => setValue({ ...value, documentNumber: e.target.value })} />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        {
          key: 'fio',
          title: 'ФИО',
          render: (item) =>
            `${item.lastName || ''} ${item.firstName || ''} ${item.middleName || ''}`,
        },
        { key: 'type', title: 'Тип', render: (item) => item.personType || '—' },
        { key: 'tab', title: 'Табельный', render: (item) => item.personnelNumber || '—' },
        { key: 'phone', title: 'Телефон', render: (item) => item.phone || '—' },
      ]}
      getDeleteLabel={(item) =>
        `${item.lastName || ''} ${item.firstName || ''}`.trim() || item.id
      }
    />
  );
}