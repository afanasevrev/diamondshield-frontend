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
  type AccessIdentifier,
  blockIdentifier,
  createIdentifier,
  getIdentifiers,
  getPersons,
  type Person,
} from '../api/centralApi';

export function IdentifiersPage() {
  const [items, setItems] = useState<AccessIdentifier[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [personId, setPersonId] = useState('');
  const [identifierType, setIdentifierType] = useState('card');
  const [identifierValue, setIdentifierValue] = useState('1234567890');
  const [validFrom, setValidFrom] = useState('2025-01-01T00:00');
  const [validTo, setValidTo] = useState('2030-12-31T23:59');
  const [comment, setComment] = useState('Тестовая карта');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [nextPersons, nextItems] = await Promise.all([
        getPersons(),
        getIdentifiers(),
      ]);

      setPersons(nextPersons);
      setItems(nextItems);

      if (!personId && nextPersons.length > 0) {
        setPersonId(nextPersons[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки идентификаторов');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setError(null);
      setActionMessage(null);

      await createIdentifier({
        personId,
        identifierType,
        identifierValue,
        validFrom: `${validFrom}:00`,
        validTo: `${validTo}:00`,
        comment,
      });

      setActionMessage('Идентификатор добавлен');

      await load();
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка добавления идентификатора',
      );
    }
  }

  async function handleBlock(id: string) {
    try {
      setError(null);
      setActionMessage(null);

      await blockIdentifier(id);

      setActionMessage('Идентификатор заблокирован');

      await load();
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка блокировки идентификатора',
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Идентификаторы доступа"
        description="Карты, PIN, QR и другие идентификаторы пользователей"
        actions={<Button variant="secondary" onClick={load}>Обновить</Button>}
      />

      {error && <ErrorMessage message={error} />}

      {actionMessage && (
        <Card>
          <Badge tone="success">{actionMessage}</Badge>
        </Card>
      )}

      <Card title="Добавить идентификатор">
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
            label="Тип"
            value={identifierType}
            onChange={(e) => setIdentifierType(e.target.value)}
            options={[
              { label: 'Карта', value: 'card' },
              { label: 'PIN', value: 'pin' },
              { label: 'QR', value: 'qr' },
            ]}
          />

          <Input
            label="Значение идентификатора"
            value={identifierValue}
            onChange={(e) => setIdentifierValue(e.target.value)}
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

          <Input label="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={!personId}>
              Добавить
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Список идентификаторов">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={items}
            getRowKey={(item) => item.id}
            columns={[
              { key: 'id', title: 'ID', render: (item) => item.id },
              { key: 'person', title: 'Person ID', render: (item) => item.personId || '—' },
              { key: 'type', title: 'Тип', render: (item) => item.identifierType || '—' },
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