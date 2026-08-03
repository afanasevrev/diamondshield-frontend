import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { StatusDot } from '../../../components/badges/StatusDot';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { PageHeader } from '../../../components/page/PageHeader';
import {
  banPercoAccess,
  closePercoExdev,
  getPercoSessions,
  openPercoExdev,
  type PercoSession,
  setPercoAccessMode,
} from '../perco/localPercoApi';

export function LocalManualControlPage() {
  const [sessions, setSessions] = useState<PercoSession[]>([]);
  const [controllerId, setControllerId] = useState('');
  const [manualControllerId, setManualControllerId] = useState('');
  const [number, setNumber] = useState('0');
  const [direction, setDirection] = useState('0');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const controllerOptions = useMemo(() => {
    const ids = Array.from(
      new Set(
        sessions
          .map((item) => item.controllerId)
          .filter((item): item is string => Boolean(item)),
      ),
    );

    return ids.map((id) => ({
      label: id,
      value: id,
    }));
  }, [sessions]);

  function getSelectedControllerId() {
    return manualControllerId.trim() || controllerId;
  }

  function requireControllerId() {
    const id = getSelectedControllerId();

    if (!id) {
      throw new Error('Не выбран controllerId');
    }

    return id;
  }

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const response = await getPercoSessions();

      setSessions(response.sessions || []);

      const firstControllerId =
        response.sessions?.find((item) => item.controllerId)?.controllerId || '';

      if (!controllerId && firstControllerId) {
        setControllerId(firstControllerId);
      }
    } catch (ex) {
      setError(
        ex instanceof Error ? ex.message : 'Ошибка загрузки PERCo-сессий',
      );
    } finally {
      setLoading(false);
    }
  }

  async function runAction(action: () => Promise<unknown>, successMessage: string) {
    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);

      await action();

      setMessage(successMessage);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка выполнения команды');
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Ручное управление"
        description="Открытие, закрытие, запрет прохода и режимы доступа PERCo C01"
        actions={
          <Button variant="secondary" onClick={load}>
            Обновить сессии
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      {message && (
        <Card>
          <Badge tone="success">{message}</Badge>
        </Card>
      )}

      <div className="ds-grid ds-grid-3">
        <Card title="PERCo-сессии">
          {loading ? (
            <Loading />
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              <StatusDot
                status={sessions.length > 0 ? 'online' : 'offline'}
                label={`Подключений: ${sessions.length}`}
              />

              <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                Для управления нужно подключение контроллера через WebSocket.
              </div>
            </div>
          )}
        </Card>

        <Card title="Контроллер">
          <div style={{ display: 'grid', gap: 14 }}>
            <Select
              label="controllerId из сессий"
              value={controllerId}
              onChange={(e) => setControllerId(e.target.value)}
              options={[
                { label: 'Не выбран', value: '' },
                ...controllerOptions,
              ]}
            />

            <Input
              label="controllerId вручную"
              value={manualControllerId}
              onChange={(e) => setManualControllerId(e.target.value)}
              placeholder="UUID контроллера"
            />
          </div>
        </Card>

        <Card title="Параметры ИУ">
          <div style={{ display: 'grid', gap: 14 }}>
            <Input
              label="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <Input
              label="direction"
              type="number"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            />
          </div>
        </Card>
      </div>

      <Card title="Команды">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            disabled={actionLoading}
            onClick={() =>
              runAction(
                () =>
                  openPercoExdev(
                    requireControllerId(),
                    Number(number),
                    Number(direction),
                  ),
                'ИУ открыто',
              )
            }
          >
            Открыть
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(
                () =>
                  closePercoExdev(
                    requireControllerId(),
                    Number(number),
                    Number(direction),
                  ),
                'ИУ закрыто',
              )
            }
          >
            Закрыть
          </Button>

          <Button
            variant="danger"
            disabled={actionLoading}
            onClick={() =>
              runAction(
                () =>
                  banPercoAccess(
                    requireControllerId(),
                    Number(number),
                    Number(direction),
                  ),
                'Проход запрещен',
              )
            }
          >
            Запретить проход
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(
                () =>
                  setPercoAccessMode(
                    requireControllerId(),
                    Number(number),
                    Number(direction),
                    'open',
                  ),
                'Режим open установлен',
              )
            }
          >
            Режим open
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(
                () =>
                  setPercoAccessMode(
                    requireControllerId(),
                    Number(number),
                    Number(direction),
                    'control',
                  ),
                'Режим control установлен',
              )
            }
          >
            Режим control
          </Button>
        </div>
      </Card>
    </div>
  );
}