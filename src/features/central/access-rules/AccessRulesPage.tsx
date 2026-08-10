import { Badge } from '../../../components/badges/Badge';
import { Input } from '../../../components/forms/Input';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import {
  type AccessRule,
  createAccessRule,
  getAccessRules,
} from '../api/centralApi';
import { deleteAccessRule, updateAccessRule } from '../api/crudCentralApi';

interface AccessRuleForm {
  personId: string;
  accessPointId: string;
  scheduleId: string;
  //priority?: number;
  active?: boolean;
}

export function AccessRulesPage() {
  return (
    <EntityCrudPage<AccessRule, AccessRuleForm, AccessRuleForm>
      title="Правила доступа"
      description="Кто, куда и по какому расписанию может проходить"
      createTitle="Создать правило"
      listTitle="Список правил"
      editTitle="Редактировать правило"
      deleteTitle="Удалить правило?"
      loadItems={getAccessRules}
      createItem={createAccessRule}
      updateItem={updateAccessRule}
      deleteItem={deleteAccessRule}
      initialCreateState={{
        personId: '',
        accessPointId: '',
        scheduleId: '',
        //priority: 100,
        active: true,
      }}
      createForm={(value, setValue) => (
        <>
          <Input label="personId" value={value.personId} onChange={(e) => setValue({ ...value, personId: e.target.value })} />
          <Input label="accessPointId" value={value.accessPointId} onChange={(e) => setValue({ ...value, accessPointId: e.target.value })} />
          <Input label="scheduleId" value={value.scheduleId} onChange={(e) => setValue({ ...value, scheduleId: e.target.value })} />
        </>
      )}
      toUpdateState={(item) => ({
        personId: item.personId || '',
        accessPointId: item.accessPointId || '',
        scheduleId: item.scheduleId || '',
        //priority: item.priority ?? 100,
        active: item.active ?? true,
      })}
      editForm={(value, setValue) => (
        <>
          <Input label="personId" value={value.personId} onChange={(e) => setValue({ ...value, personId: e.target.value })} />
          <Input label="accessPointId" value={value.accessPointId} onChange={(e) => setValue({ ...value, accessPointId: e.target.value })} />
          <Input label="scheduleId" value={value.scheduleId} onChange={(e) => setValue({ ...value, scheduleId: e.target.value })} />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'person', title: 'personId', render: (item) => item.personId || '—' },
        { key: 'point', title: 'accessPointId', render: (item) => item.accessPointId || '—' },
        { key: 'schedule', title: 'scheduleId', render: (item) => item.scheduleId || '—' },
        //{ key: 'priority', title: 'Приоритет', render: (item) => item.priority ?? '—' },
        {
          key: 'active',
          title: 'Активно',
          render: (item) => (
            <Badge tone={item.active === false ? 'danger' : 'success'}>
              {item.active === false ? 'no' : 'yes'}
            </Badge>
          ),
        },
      ]}
      getDeleteLabel={(item) => item.id}
    />
  );
}