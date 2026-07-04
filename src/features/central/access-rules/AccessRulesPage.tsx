import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import {
  type AccessPoint,
  type AccessRule,
  createAccessRule,
  getAccessPoints,
  getAccessRules,
  getPersons,
  getSchedules,
  type Person,
  type Schedule,
} from '../api/centralApi';

export function AccessRulesPage() {
  const [items, setItems] = useState<AccessRule[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [personId, setPersonId] = useState('');
  const [accessPointId, setAccessPointId] = useState('');
  const [scheduleId, setScheduleId] = useState('');
  const [validFrom, setValidFrom] = useState('2025-01-01T00:00');
  const [validTo, setValidTo] = useState('2030-12-31T23:59');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextPersons, nextPoints, nextSchedules, nextRules] =
        await Promise.all([
          getPersons(),
          getAccessPoints(),
          getSchedules(),
          getAccessRules(),
        ]);

      setPersons(nextPersons);
      setAccessPoints(nextPoints);
      setSchedules(nextSchedules);
      setItems(nextRules);

      if (!personId && nextPersons.length > 0) {
        setPersonId(nextPersons[0].id);
      }

      if (!accessPointId && nextPoints.length > 0) {
        setAccessPointId(nextPoints[0].id);
      }

      if (!scheduleId && nextSchedules.length > 0) {
        setScheduleId(nextSchedules[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки правил доступа');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createAccessRule({
        personId,
        accessPointId,
        scheduleId,
        validFrom: `${validFrom}:00`,
        validTo: `${validTo}:00`,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания правила доступа');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Правила доступа"
        description="Связь пользователя, точки прохода и расписания"
        actions={<Button variant="secondary" onClick={load}>Обновить</Button>}
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать правило доступа">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Физическое лицо"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            options={persons.map((item) => ({
              label: `${item.lastName} ${item.firstName} ${item.middleName || ''}`,
              value: item.id,
            }))}
          />

          <Select
            label="Точка прохода"
            value={accessPointId}
            onChange={(e) => setAccessPointId(e.target.value)}
            options={accessPoints.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Select
            label="Расписание"
            value={scheduleId}
            onChange={(e) => setScheduleId(e.target.value)}
            options={schedules.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Input
            label="Действует с"
            type="datetime-local"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />

          <Input
            label="Действует до"
            type="datetime-local"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!personId || !accessPointId || !scheduleId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список правил доступа">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'person', title: 'Person ID', render: (item) => item.personId || '—' },
              {
                key: 'point',
                title: 'AccessPoint ID',
                render: (item) => item.accessPointId || '—',
              },
              {
                key: 'schedule',
                title: 'Schedule ID',
                render: (item) => item.scheduleId || '—',
              },
              {
                key: 'active',
                title: 'Активно',
                render: (item) => (
                  <Badge tone={item.active === false || item.isActive === false ? 'muted' : 'success'}>
                    {item.active === false || item.isActive === false ? 'no' : 'yes'}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}