import { type SubmitEvent, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Input } from '../../../components/forms/Input';
import { TextArea } from '../../../components/forms/TextArea';
import { createPublicGuestRequest } from '../api/guestApi';

export function PublicGuestRequestPage() {
  const [lastName, setLastName] = useState('Петров');
  const [firstName, setFirstName] = useState('Петр');
  const [middleName, setMiddleName] = useState('Петрович');

  const [phone, setPhone] = useState('+79991112233');
  const [email, setEmail] = useState('guest@example.com');

  const [documentType, setDocumentType] = useState('passport');
  const [documentSeries, setDocumentSeries] = useState('4501');
  const [documentNumber, setDocumentNumber] = useState('654321');

  const [visitDate, setVisitDate] = useState('2026-07-05');
  const [visitTimeFrom, setVisitTimeFrom] = useState('09:00');
  const [visitTimeTo, setVisitTimeTo] = useState('18:00');

  const [hostPersonFullName, setHostPersonFullName] = useState('Иванов Иван Иванович');
  const [hostPersonPhone, setHostPersonPhone] = useState('+79990000000');

  const [purpose, setPurpose] = useState('Деловая встреча');
  const [personalDataConsent, setPersonalDataConsent] = useState(false);

  const [createdId, setCreatedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!personalDataConsent) {
      setError('Нужно дать согласие на обработку персональных данных');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCreatedId('');

      const response = await createPublicGuestRequest({
        lastName,
        firstName,
        middleName,
        phone,
        email,
        documentType,
        documentSeries,
        documentNumber,
        visitDate,
        visitTimeFrom: `${visitTimeFrom}:00`,
        visitTimeTo: `${visitTimeTo}:00`,
        hostPersonFullName,
        hostPersonPhone,
        purpose,
        personalDataConsent,
      });

      setCreatedId(response.id);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка отправки заявки');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-login-page ds-crystal-bg">
      <div style={{ width: 'min(980px, 100%)', padding: 24 }}>
        <div className="ds-login-brand" style={{ marginBottom: 24 }}>
          <div className="ds-login-logo">DS</div>

          <div>
            <h1>Diamond Shield</h1>
            <p>Гостевая заявка</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {createdId && (
          <Card title="Заявка отправлена">
            <div style={{ display: 'grid', gap: 12 }}>
              <Badge tone="success">Заявка создана</Badge>

              <div style={{ color: 'var(--ds-text-soft)' }}>
                Номер заявки:
              </div>

              <code style={{ color: 'var(--ds-primary)' }}></code> {createdId}
                <div style={{ color: 'var(--ds-text-muted)' }}>
                Ожидайте согласования принимающей стороной.
              </div>
            </div>
          </Card>)}

        <Card
          title="Заявка на посещение"
          subtitle="Заполните данные гостя и параметры визита"
        >
          <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
            <Input label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Input label="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Отчество" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />

            <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input label="Тип документа" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
            <Input label="Серия документа" value={documentSeries} onChange={(e) => setDocumentSeries(e.target.value)} />
            <Input label="Номер документа" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />

            <Input label="Дата визита" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            <Input label="С" type="time" value={visitTimeFrom} onChange={(e) => setVisitTimeFrom(e.target.value)} />
            <Input label="До" type="time" value={visitTimeTo} onChange={(e) => setVisitTimeTo(e.target.value)} />

            <Input
              label="Принимающий сотрудник"
              value={hostPersonFullName}
              onChange={(e) => setHostPersonFullName(e.target.value)}
            />

            <Input
              label="Телефон принимающего"
              value={hostPersonPhone}
              onChange={(e) => setHostPersonPhone(e.target.value)}
            />

            <TextArea
              label="Цель визита"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <label
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                color: 'var(--ds-text-soft)',
                gridColumn: '1 / -1',
              }}
            >
              <input
                type="checkbox"
                checked={personalDataConsent}
                onChange={(e) => setPersonalDataConsent(e.target.checked)}
              />

              <span>
                Я даю согласие на обработку персональных данных для оформления
                гостевого доступа.
              </span>
            </label>

            <div>
              <Button type="submit" disabled={loading}>
                {loading? 'Отправка...': 'Отправить заявку'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>);
}