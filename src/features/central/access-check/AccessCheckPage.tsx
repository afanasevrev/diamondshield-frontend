import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { PageHeader } from '../../../components/page/PageHeader';
import {
  type AccessCheckResponse,
  type AccessPoint,
  checkAccess,
  type DsObject,
  getAccessPoints,
  getObjects,
} from '../api/centralApi';
import { formatDateTime } from '../../../shared/utils/formatDate';

export function AccessCheckPage() {
  const [objects, setObjects] = useState<DsObject[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AccessCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [objectId, setObjectId] = useState('');
  const [accessPointId, setAccessPointId] = useState('');
  const [identifierType, setIdentifierType] = useState('card');
  const [identifierValue, setIdentifierValue] = useState('1234567890');
  const [direction, setDirection] = useState('in');

  async function loadDictionaries() {
    try {
      setError(null);

      const [nextObjects, nextPoints] = await Promise.all([
        getObjects(),
        getAccessPoints(),
      ]);

      setObjects(nextObjects);
      setAccessPoints(nextPoints);

      if (!objectId && nextObjects.length > 0) {
        setObjectId(nextObjects[0].id);
      }

      if (!accessPointId && nextPoints.length > 0) {
        setAccessPointId(nextPoints[0].id);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки справочников');
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await checkAccess({
        identifierType,
        identifierValue,
        accessPointId,
        objectId,
        direction,
      });

      setResult(response);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка проверки доступа');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDictionaries();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Проверка доступа"
        description="Проверка карты или другого идентификатора через центральный сервер"
        actions={
          <Button variant="secondary" onClick={loadDictionaries}>
            Обновить справочники
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <Card title="Запрос проверки">
        <form className="ds-grid ds-grid-3" onSubmit={handleSubmit}>
          <Select
            label="Объект"
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
            options={objects.map((item) => ({
              label: item.name,
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
            label="Тип идентификатора"
            value={identifierType}
            onChange={(e) => setIdentifierType(e.target.value)}
            options={[
              { label: 'Карта', value: 'card' },
              { label: 'PIN', value: 'pin' },
              { label: 'QR', value: 'qr' },
            ]}
          />

          <Input
            label="Значение"
            value={identifierValue}
            onChange={(e) => setIdentifierValue(e.target.value)}
          />

          <Select
            label="Направление"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            options={[
              { label: 'Вход', value: 'in' },
              { label: 'Выход', value: 'out' },
            ]}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={loading || !objectId || !accessPointId}>
              {loading ? 'Проверка...' : 'Проверить'}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Быстрые тесты">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => setIdentifierValue('1234567890')}
          >
            Карта 1234567890
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIdentifierValue('UNKNOWN-CARD-999')}
          >
            UNKNOWN-CARD-999
          </Button>
        </div>
      </Card>

      {result && (
        <Card title="Результат проверки">
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <Badge tone={result.allowed ? 'success' : 'danger'}>
                {result.allowed ? 'allowed' : 'denied'}
              </Badge>
            </div>

            <Info label="Decision" value={result.decision} />
            <Info label="Reason" value={result.reason} />
            <Info label="Person" value={result.personFullName || result.personId} />
            <Info label="Identifier" value={result.identifierMasked || result.identifierId} />
            <Info label="Access event ID" value={result.accessEventId} />
            <Info label="Checked at" value={formatDateTime(result.checkedAt)} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px minmax(0, 1fr)',
        gap: 12,
      }}
    >
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
      <div style={{ color: 'var(--ds-text-soft)', overflowWrap: 'anywhere' }}>
        {value || '—'}
      </div>
    </div>
  );
}