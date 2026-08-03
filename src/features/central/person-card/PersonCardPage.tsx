import { type SubmitEvent, useEffect, useMemo, useState } from 'react';
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
  type AccessIdentifier,
  blockPersonIdentifier,
  createPersonIdentifier,
  getPersonIdentifiers,
  type Person,
} from '../api/personCardApi';
import { getPersons } from '../api/centralApi';

export function PersonCardPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [identifiers, setIdentifiers] = useState<AccessIdentifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [identifiersLoading, setIdentifiersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [identifierType, setIdentifierType] = useState('card');
  const [identifierValue, setIdentifierValue] = useState('1234567890');
  const [validFrom, setValidFrom] = useState('2025-01-01T00:00');
  const [validTo, setValidTo] = useState('2030-12-31T23:59');
  const [comment, setComment] = useState('');

  const selectedPerson = useMemo(
    () => persons.find((item) => item.id === selectedPersonId) || null,
    [persons, selectedPersonId],
  );

  async function loadPersons() {
    try {
      setLoading(true);
      setError(null);

      const response = await getPersons();

      setPersons(response);

      if (!selectedPersonId && response.length > 0) {
        setSelectedPersonId(response[0].id);
        await loadIdentifiers(response[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки физических лиц');
    } finally {
      setLoading(false);
    }
  }

  async function loadIdentifiers(personId = selectedPersonId) {
    if (!personId) {
      return;
    }

    try {
      setIdentifiersLoading(true);
      setError(null);

      setIdentifiers(await getPersonIdentifiers(personId));
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки идентификаторов');
    } finally {
      setIdentifiersLoading(false);
    }
  }

  async function handlePersonChange(personId: string) {
    setSelectedPersonId(personId);
    await loadIdentifiers(personId);
  }

  async function handleAddIdentifier(event: SubmitEvent) {
    event.preventDefault();

    if (!selectedPersonId) {
      setError('Выбери физическое лицо');
      return;
    }

    try {
      setError(null);
      setMessage(null);

      await createPersonIdentifier({
        personId: selectedPersonId,
        identifierType,
        identifierValue,
        validFrom: `${validFrom}:00`,
        validTo: `${validTo}:00`,
        comment,
      });

      setMessage('Идентификатор добавлен');

      await loadIdentifiers(selectedPersonId);
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка добавления идентификатора',
      );
    }
  }

  async function handleBlock(identifierId: string) {
    try {
      setError(null);
      setMessage(null);

      await blockPersonIdentifier(identifierId);

      setMessage('Идентификатор заблокирован');

      await loadIdentifiers(selectedPersonId);
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка блокировки идентификатора',
      );
    }
  }

  useEffect(() => {
    loadPersons();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Карточка физического лица"
        description="Данные пользователя, идентификаторы и операции с картами"
        actions={
          <Button variant="secondary" onClick={loadPersons}>
            Обновить
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {message && (
        <Card>
          <Badge tone="success">{message}</Badge>
        </Card>
      )}

      <Card title="Выбор физического лица">
        {loading ? (
          <Loading />
        ) : (
          <Select
            label="Физическое лицо"
            value={selectedPersonId}
            onChange={(event) => handlePersonChange(event.target.value)}
            options={persons.map((item) => ({
              label: `${item.lastName || ''} ${item.firstName || ''} ${
                item.middleName || ''
              } — ${item.personnelNumber || item.id}`,
              value: item.id,
            }))}
          />
        )}
      </Card>

      {selectedPerson && (
        <div className="ds-grid ds-grid-2">
          <Card title="Основные данные">
            <Info label="ID" value={selectedPerson.id} />
            <Info
              label="ФИО"
              value={`${selectedPerson.lastName || ''} ${
                selectedPerson.firstName || ''
              } ${selectedPerson.middleName || ''}`}
            />
            <Info label="Тип" value={selectedPerson.personType || '—'} />
            <Info
              label="Табельный"
              value={selectedPerson.personnelNumber || '—'}
            />
            <Info label="Телефон" value={selectedPerson.phone || '—'} />
            <Info label="Email" value={selectedPerson.email || '—'} />
            <Info
              label="Документ"
              value={`${selectedPerson.documentType || '—'} ${
                selectedPerson.documentSeries || ''
              } ${selectedPerson.documentNumber || ''}`}
            />
          </Card>

          <Card title="Добавить идентификатор">
            <form className="ds-grid" onSubmit={handleAddIdentifier}>
              <Select
                label="Тип"
                value={identifierType}
                onChange={(event) => setIdentifierType(event.target.value)}
                options={[
                  { label: 'Карта', value: 'card' },
                  { label: 'PIN', value: 'pin' },
                  { label: 'QR', value: 'qr' },
                ]}
              />

              <Input
                label="Значение"
                value={identifierValue}
                onChange={(event) => setIdentifierValue(event.target.value)}
                placeholder="1234567890"
              />

              <Input
                label="Действует с"
                type="datetime-local"
                value={validFrom}
                onChange={(event) => setValidFrom(event.target.value)}
              />

              <Input
                label="Действует до"
                type="datetime-local"
                value={validTo}
                onChange={(event) => setValidTo(event.target.value)}
              />

              <Input
                label="Комментарий"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />

              <Button type="submit">Добавить</Button>
            </form>
          </Card>
        </div>
      )}

      <Card title="Идентификаторы пользователя">
        {identifiersLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={identifiers}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'id',
                title: 'ID',
                render: (item) => item.id,
              },
              {
                key: 'type',
                title: 'Тип',
                render: (item) => item.identifierType || '—',
              },
              {
                key: 'masked',
                title: 'Маска',
                render: (item) => item.identifierMasked || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={item.status === 'active' ? 'success' : 'warning'}>
                    {item.status || '—'}
                  </Badge>
                ),
              },
              {
                key: 'comment',
                title: 'Комментарий',
                render: (item) => item.comment || '—',
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleBlock(item.id)}
                  >
                    Заблокировать
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '130px minmax(0, 1fr)',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>
  );
}