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
  createPerson,
  getOrganizations,
  getPersons,
  type Organization,
  type Person,
} from '../api/centralApi';

export function PersonsPage() {
  const [items, setItems] = useState<Person[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [organizationId, setOrganizationId] = useState('');
  const [personType, setPersonType] = useState('employee');
  const [personnelNumber, setPersonnelNumber] = useState('EMP-001');
  const [lastName, setLastName] = useState('Иванов');
  const [firstName, setFirstName] = useState('Иван');
  const [middleName, setMiddleName] = useState('Иванович');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [phone, setPhone] = useState('+79990000000');
  const [email, setEmail] = useState('ivanov@example.com');
  const [documentType, setDocumentType] = useState('passport');
  const [documentSeries, setDocumentSeries] = useState('4500');
  const [documentNumber, setDocumentNumber] = useState('123456');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [orgs, persons] = await Promise.all([getOrganizations(), getPersons()]);

      setOrganizations(orgs);
      setItems(persons);

      if (!organizationId && orgs.length > 0) {
        setOrganizationId(orgs[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки физических лиц');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);

      await createPerson({
        organizationId,
        personType,
        personnelNumber,
        lastName,
        firstName,
        middleName,
        birthDate,
        phone,
        email,
        documentType,
        documentSeries,
        documentNumber,
      });

      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка создания физического лица');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Физические лица"
        description="Сотрудники, жильцы, гости и другие пользователи доступа"
        actions={<Button variant="secondary" onClick={load}>Обновить</Button>}
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Создать физическое лицо">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Организация"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            options={organizations.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <Select
            label="Тип лица"
            value={personType}
            onChange={(e) => setPersonType(e.target.value)}
            options={[
              { label: 'Сотрудник', value: 'employee' },
              { label: 'Жилец', value: 'resident' },
              { label: 'Гость', value: 'guest' },
            ]}
          />

          <Input
            label="Табельный номер"
            value={personnelNumber}
            onChange={(e) => setPersonnelNumber(e.target.value)}
          />

          <Input label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Отчество" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />

          <Input label="Дата рождения" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Input label="Тип документа" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
          <Input label="Серия" value={documentSeries} onChange={(e) => setDocumentSeries(e.target.value)} />
          <Input label="Номер" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!organizationId}>
              Создать
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список физических лиц">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              {
                key: 'fio',
                title: 'ФИО',
                render: (item) =>
                  `${item.lastName || ''} ${item.firstName || ''} ${item.middleName || ''}`,
              },
              {
                key: 'type',
                title: 'Тип',
                render: (item) => <Badge tone="info">{item.personType || '—'}</Badge>,
              },
              {
                key: 'personnel',
                title: 'Табельный',
                render: (item) => item.personnelNumber || '—',
              },
              { key: 'phone', title: 'Телефон', render: (item) => item.phone || '—' },
              { key: 'email', title: 'Email', render: (item) => item.email || '—' },
            ]}
          />
        )}
      </Card>
    </div>
  );
}