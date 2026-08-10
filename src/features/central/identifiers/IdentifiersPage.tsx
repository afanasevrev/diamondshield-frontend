import { Badge } from '../../../components/badges/Badge';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  type AccessIdentifier,
  createIdentifier,
  getIdentifiers,
} from '../api/centralApi';
import { deleteIdentifier, updateIdentifier } from '../api/crudCentralApi';

interface IdentifierForm {
  personId: string;
  identifierType: string;
  identifierValue: string;
  status?: string;
  validFrom?: string;
  validTo?: string;
  comment?: string;
}

export function IdentifiersPage() {
  return (
    <EntityCrudPage<AccessIdentifier, IdentifierForm, IdentifierForm>
      title="Идентификаторы"
      description="Карты, QR и PIN"
      createTitle="Создать идентификатор"
      listTitle="Список идентификаторов"
      editTitle="Редактировать идентификатор"
      deleteTitle="Удалить идентификатор?"
      loadItems={getIdentifiers}
      createItem={createIdentifier}
      updateItem={updateIdentifier}
      deleteItem={deleteIdentifier}
      initialCreateState={{
        personId: '',
        identifierType: 'card',
        identifierValue: '1234567890',
        status: 'active',
        validFrom: '2025-01-01T00:00:00',
        validTo: '2030-12-31T23:59:00',
        comment: '',
      }}
      createForm={(value, setValue) => (
        <>
          <Input label="personId" value={value.personId} onChange={(e) => setValue({ ...value, personId: e.target.value })} />

          <Select
            label="Тип"
            value={value.identifierType}
            onChange={(e) =>
              setValue({ ...value, identifierType: e.target.value })
            }
            options={[
              { label: 'Карта', value: 'card' },
              { label: 'QR', value: 'qr' },
              { label: 'PIN', value: 'pin' },
            ]}
          />

          <Input label="Значение" value={value.identifierValue || ''} onChange={(e) => setValue({ ...value, identifierValue: e.target.value })} />
          <Input label="validFrom" value={value.validFrom || ''} onChange={(e) => setValue({ ...value, validFrom: e.target.value })} />
          <Input label="validTo" value={value.validTo || ''} onChange={(e) => setValue({ ...value, validTo: e.target.value })} />
          <Input label="Комментарий" value={value.comment || ''} onChange={(e) => setValue({ ...value, comment: e.target.value })} />
        </>
      )}
      toUpdateState={(item) => ({
        identifierValue: item.identifierMasked || '',
        personId: item.personId || '',
        identifierType: item.identifierType || 'card',
        status: item.status || 'active',
        validFrom: item.validFrom || '',
        validTo: item.validTo || '',
        comment: item.comment || '',
      })}
      editForm={(value, setValue) => (
        <>
          <Input label="personId" value={value.personId} onChange={(e) => setValue({ ...value, personId: e.target.value })} />

          <Select
            label="Тип"
            value={value.identifierType}
            onChange={(e) =>
              setValue({ ...value, identifierType: e.target.value })
            }
            options={[
              { label: 'Карта', value: 'card' },
              { label: 'QR', value: 'qr' },
              { label: 'PIN', value: 'pin' },
            ]}
          />

          <Select
            label="Статус"
            value={value.status || 'active'}
            onChange={(e) => setValue({ ...value, status: e.target.value })}
            options={[
              { label: 'active', value: 'active' },
              { label: 'blocked', value: 'blocked' },
              { label: 'expired', value: 'expired' },
            ]}
          />

          <Input label="validFrom" value={value.validFrom || ''} onChange={(e) => setValue({ ...value, validFrom: e.target.value })} />
          <Input label="validTo" value={value.validTo || ''} onChange={(e) => setValue({ ...value, validTo: e.target.value })} />
          <Input label="Комментарий" value={value.comment || ''} onChange={(e) => setValue({ ...value, comment: e.target.value })} />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'person', title: 'personId', render: (item) => item.personId || '—' },
        { key: 'type', title: 'Тип', render: (item) => item.identifierType || '—' },
        { key: 'masked', title: 'Маска', render: (item) => item.identifierMasked || '—' },
        {
          key: 'status',
          title: 'Статус',
          render: (item) => (
            <Badge tone={item.status === 'active' ? 'success' : 'warning'}>
              {item.status || '—'}
            </Badge>
          ),
        },
      ]}
      getDeleteLabel={(item) => item.identifierMasked || item.id}
    />
  );
}