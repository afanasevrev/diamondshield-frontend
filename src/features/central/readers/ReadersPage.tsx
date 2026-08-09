import { StatusDot } from '../../../components/badges/StatusDot';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { EntityCrudPage } from '../../../components/crud/EntityCrudPage';
import { createReader, getReaders, type Reader } from '../api/centralApi';
import { deleteReader, updateReader } from '../api/crudCentralApi';

interface ReaderForm {
  controllerId: string;
  accessPointId?: string;
  name: string;
  readerType: string;
  direction: string;
  percoExdevNumber?: number;
  percoDirection?: number;
}

export function ReadersPage() {
  return (
    <EntityCrudPage<Reader, ReaderForm, ReaderForm>
      title="Считыватели"
      description="Считыватели и PERCo mapping"
      createTitle="Создать считыватель"
      listTitle="Список считывателей"
      editTitle="Редактировать считыватель"
      deleteTitle="Удалить считыватель?"
      loadItems={getReaders}
      createItem={createReader}
      updateItem={updateReader}
      deleteItem={deleteReader}
      initialCreateState={{
        controllerId: '',
        accessPointId: '',
        name: 'Считыватель вход',
        readerType: 'RFID',
        direction: 'in',
        percoExdevNumber: 0,
        percoDirection: 0,
      }}
      createForm={(value, setValue) => (
        <>
          <Input label="controllerId" value={value.controllerId} onChange={(e) => setValue({ ...value, controllerId: e.target.value })} />
          <Input label="accessPointId" value={value.accessPointId || ''} onChange={(e) => setValue({ ...value, accessPointId: e.target.value })} />
          <Input label="Название" value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} />

          <Select
            label="Тип"
            value={value.readerType}
            onChange={(e) => setValue({ ...value, readerType: e.target.value })}
            options={[
              { label: 'RFID', value: 'RFID' },
              { label: 'QR', value: 'QR' },
              { label: 'Wiegand', value: 'Wiegand' },
            ]}
          />

          <Select
            label="Направление"
            value={value.direction}
            onChange={(e) => setValue({ ...value, direction: e.target.value })}
            options={[
              { label: 'Вход', value: 'in' },
              { label: 'Выход', value: 'out' },
            ]}
          />

          <Input label="PERCo number" type="number" value={String(value.percoExdevNumber ?? 0)} onChange={(e) => setValue({ ...value, percoExdevNumber: Number(e.target.value) })} />
          <Input label="PERCo direction" type="number" value={String(value.percoDirection ?? 0)} onChange={(e) => setValue({ ...value, percoDirection: Number(e.target.value) })} />
        </>
      )}
      toUpdateState={(item) => ({
        controllerId: item.controllerId || '',
        accessPointId: item.accessPointId || '',
        name: item.name,
        readerType: item.readerType || 'RFID',
        direction: item.direction || 'in',
        percoExdevNumber: item.percoExdevNumber ?? 0,
        percoDirection: item.percoDirection ?? 0,
      })}
      editForm={(value, setValue) => (
        <>
          <Input label="controllerId" value={value.controllerId} onChange={(e) => setValue({ ...value, controllerId: e.target.value })} />
          <Input label="accessPointId" value={value.accessPointId || ''} onChange={(e) => setValue({ ...value, accessPointId: e.target.value })} />
          <Input label="Название" value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} />

          <Select
            label="Тип"
            value={value.readerType}
            onChange={(e) => setValue({ ...value, readerType: e.target.value })}
            options={[
              { label: 'RFID', value: 'RFID' },
              { label: 'QR', value: 'QR' },
              { label: 'Wiegand', value: 'Wiegand' },
            ]}
          />

          <Select
            label="Направление"
            value={value.direction}
            onChange={(e) => setValue({ ...value, direction: e.target.value })}
            options={[
              { label: 'Вход', value: 'in' },
              { label: 'Выход', value: 'out' },
            ]}
          />

          <Input label="PERCo number" type="number" value={String(value.percoExdevNumber ?? 0)} onChange={(e) => setValue({ ...value, percoExdevNumber: Number(e.target.value) })} />
          <Input label="PERCo direction" type="number" value={String(value.percoDirection ?? 0)} onChange={(e) => setValue({ ...value, percoDirection: Number(e.target.value) })} />
        </>
      )}
      columns={[
        { key: 'id', title: 'ID', render: (item) => item.id },
        { key: 'name', title: 'Название', render: (item) => item.name },
        { key: 'controller', title: 'Контроллер', render: (item) => item.controllerId || '—' },
        { key: 'point', title: 'Точка', render: (item) => item.accessPointId || '—' },
        { key: 'type', title: 'Тип', render: (item) => item.readerType || '—' },
        { key: 'direction', title: 'Направление', render: (item) => item.direction || '—' },
        {
          key: 'status',
          title: 'Статус',
          render: (item) => <StatusDot status={item.status || 'unknown'} />,
        },
      ]}
      getDeleteLabel={(item) => item.name}
    />
  );
}