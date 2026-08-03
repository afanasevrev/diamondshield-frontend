import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { Modal } from '../../../components/modal/Modal';
import { PageHeader } from '../../../components/page/PageHeader';
import { getPersons, type Person } from '../api/centralApi';
import { createPersonIdentifier } from '../api/personCardApi';

export function CardBindingPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [personId, setPersonId] = useState('');
  const [identifierType, setIdentifierType] = useState('card');
  const [cardValue, setCardValue] = useState('');
  const [validFrom, setValidFrom] = useState('2025-01-01T00:00');
  const [validTo, setValidTo] = useState('2030-12-31T23:59');
  const [comment, setComment] = useState('Привязано через интерфейс');

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [binding, setBinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPersons() {
    try {
      setLoading(true);
      setError(null);

      const response = await getPersons();

      setPersons(response);

      if (!personId && response.length > 0) {
        setPersonId(response[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки физических лиц');
    } finally {
      setLoading(false);
    }
  }

  async function handleBind(event?: SubmitEvent) {
    event?.preventDefault();

    if (!personId) {
      setError('Выбери физическое лицо');
      return;
    }

    if (!cardValue.trim()) {
      setError('Введи номер карты');
      return;
    }

    try {
      setBinding(true);
      setError(null);
      setMessage(null);

      await createPersonIdentifier({
        personId,
        identifierType,
        identifierValue: cardValue.trim(),
        validFrom: `${validFrom}:00`,
        validTo: `${validTo}:00`,
        comment,
      });

      setMessage(`Карта ${cardValue} привязана`);
      setModalOpen(false);
      setCardValue('');
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Ошибка привязки карты',
      );
    } finally {
      setBinding(false);
    }
  }

  useEffect(() => {
    loadPersons();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Привязка карты"
        description="Привязка идентификатора к физическому лицу через считыватель или ручной MVP-режим"
        actions={
          <Button variant="secondary" onClick={loadPersons}>
            Обновить лица
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {message && (
        <Card>
          <Badge tone="success">{message}</Badge>
        </Card>
      )}

      <Card
        title="Параметры привязки"
        subtitle="После выбора пользователя открой окно ожидания карты"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="ds-grid ds-grid-2">
            <Select
              label="Физическое лицо"
              value={personId}
              onChange={(event) => setPersonId(event.target.value)}
              options={persons.map((item) => ({
                label: `${item.lastName || ''} ${item.firstName || ''} ${
                  item.middleName || ''
                } — ${item.personnelNumber || item.id}`,
                value: item.id,
              }))}
            />

            <Select
              label="Тип идентификатора"
              value={identifierType}
              onChange={(event) => setIdentifierType(event.target.value)}
              options={[
                { label: 'Карта', value: 'card' },
                { label: 'PIN', value: 'pin' },
                { label: 'QR', value: 'qr' },
              ]}
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

            <div style={{ alignSelf: 'end' }}>
              <Button disabled={!personId} onClick={() => setModalOpen(true)}>
                Ожидать карту
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Как будет работать WebSocket-привязка позже">
        <ol style={{ margin: 0, color: 'var(--ds-text-soft)' }}>
          <li>Оператор нажимает «Ожидать карту».</li>
          <li>Frontend открывает WebSocket или подписку на событие card-read.</li>
          <li>Пользователь прикладывает карту к считывателю.</li>
          <li>Backend присылает card value.</li>
          <li>Frontend создает access identifier через /api/access-identifiers.</li>
        </ol>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ожидание карты"
        description="MVP-режим: введи номер карты вручную. Позже сюда подключим событие считывателя."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>

            <Button disabled={binding || !cardValue} onClick={() => handleBind()}>
              {binding ? 'Привязка...' : 'Привязать'}
            </Button>
          </>
        }
      >
        <form className="ds-grid" onSubmit={handleBind}>
          <Input
            label="Номер карты"
            value={cardValue}
            onChange={(event) => setCardValue(event.target.value)}
            placeholder="1234567890"
            autoFocus
          />

          <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
            Если backend вернет 409 Conflict, значит такая карта уже существует.
          </div>
        </form>
      </Modal>
    </div>
  );
}