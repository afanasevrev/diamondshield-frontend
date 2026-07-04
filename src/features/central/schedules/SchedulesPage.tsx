import { type SubmitEvent, useEffect, useState } from 'react';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { TextArea } from '../../../components/forms/TextArea';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  createSchedule,
  getOrganizations,
  getSchedules,
  type Organization,
  type Schedule,
} from '../api/centralApi';

function build247Intervals() {
  return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => ({
    dayOfWeek,
    startTime: '00:00:00',
    endTime: '23:59:59',
  }));
}

export function SchedulesPage() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [organizationId, setOrganizationId] = useState('');
  const [name, setName] = useState('Круглосуточно');
  const [description, setDescription] = useState('Тестовое расписание 24/7');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [orgs, schedules] = await Promise.all([
        getOrganizations(),
        getSchedules(),
      ]);

      setOrganizations(orgs);
      setItems(schedules);

      if (!organizationId && orgs.length > 0) {
        setOrganizationId(orgs[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки расписаний');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createSchedule({
        organizationId,
        name,
        description,
        intervals: build247Intervals(),
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания расписания');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Расписания"
        description="Временные интервалы доступа"
        actions={<Button variant="secondary" onClick={load}>Обновить</Button>}
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать расписание 24/7">
        <form className="ds-grid ds-grid-2" onSubmit={handleSubmit}>
          <Select
            label="Организация"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            options={organizations.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />

          <TextArea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!organizationId}>
              Создать 24/7
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список расписаний">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'name', title: 'Название', render: (item) => item.name },
              {
                key: 'org',
                title: 'Организация',
                render: (item) => item.organizationId || '—',
              },
              {
                key: 'description',
                title: 'Описание',
                render: (item) => item.description || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}