import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import { createSchedule, getSchedules, type Schedule } from '../api/centralApi';
import { deleteSchedule, updateSchedule } from '../api/crudCentralApi';

interface ScheduleForm {
  organizationId: string;
  name: string;
  description?: string;
  intervals: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

function buildSafeIntervals() {
  return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => ({
    dayOfWeek,
    startTime: '09:00:00',
    endTime: '23:59:59',
  }));
}

export function SchedulesPage() {
  return (
    <EntityCrudPage<Schedule, ScheduleForm, ScheduleForm>
      title="Расписания"
      description="Расписания доступа"
      createTitle="Создать расписание"
      listTitle="Список расписаний"
      editTitle="Редактировать расписание"
      deleteTitle="Удалить расписание?"
      loadItems={getSchedules}
      createItem={createSchedule}
      updateItem={updateSchedule}
      deleteItem={deleteSchedule}
      initialCreateState={{
        organizationId: '',
        name: 'Тестовое ежедневное',
        description: 'Безопасный интервал 09:00-23:59 из-за timezone бага backend',
        intervals: buildSafeIntervals(),
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
        description: item.description || '',
        intervals: item.intervals ?? [],
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
        { key: 'description', title: 'Описание', render: (item) => item.description || '—' },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}