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
import { DataTable } from '../../../components/table/DataTable';
import { pullLocalConfig, pushLocalEvents } from '../diagnostics/localDiagnosticsApi';
import {
  banPercoAccess,
  closePercoExdev,
  getPercoSessions,
  openPercoExdev,
  type PercoSession,
  requestPercoExdev,
  requestPercoNet,
  requestPercoReader,
  requestPercoState,
  setPercoAccessMode,
} from './localPercoApi';

export function LocalPercoPage() {
  const [sessions, setSessions] = useState<PercoSession[]>([]);
  const [openSessions, setOpenSessions] = useState(0);
  const [controllerId, setControllerId] = useState('');
  const [manualControllerId, setManualControllerId] = useState('');
  const [number, setNumber] = useState('0');
  const [direction, setDirection] = useState('0');
  const [readerNumber, setReaderNumber] = useState('0');
  const [exdevNumber, setExdevNumber] = useState('0');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const controllerOptions = useMemo(() => {
    const uniqueIds = Array.from(
      new Set(
        sessions
          .map((item) => item.controllerId)
          .filter((item): item is string => Boolean(item)),
      ),
    );

    return uniqueIds.map((id) => ({
      label: id,
      value: id,
    }));
  }, [sessions]);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const response = await getPercoSessions();

      setOpenSessions(response.openSessions);
      setSessions(response.sessions || []);

      const firstControllerId =
        response.sessions?.find((item) => item.controllerId)?.controllerId || '';

      if (!controllerId && firstControllerId) {
        setControllerId(firstControllerId);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки PERCo-сессий');
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
      await load();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка выполнения команды');
    } finally {
      setActionLoading(false);
    }
  }

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

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="PERCo C01"
        description="Локальное управление одним или несколькими контроллерами PERCo C01"
        actions={
          <>
            <Button variant="secondary" onClick={load}>
              Обновить сессии
            </Button>

            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={() =>
                runAction(
                  () => pullLocalConfig(),
                  'Конфигурация запрошена с центрального сервера',
                )
              }
            >
              Pull config
            </Button>

            <Button
              disabled={actionLoading}
              onClick={() =>
                runAction(
                  () => pushLocalEvents(),
                  'События отправлены в центральный сервер',
                )
              }
            >
              Push events
            </Button>
          </>
        }
      />

      {error && <ErrorMessage message={error} />}

      {message && (
        <Card>
          <Badge tone="success">{message}</Badge>
        </Card>
      )}

      <div className="ds-grid ds-grid-3">
        <Card title="Сессии PERCo" subtitle="Активные WebSocket-подключения">
          {loading ? (
            <Loading />
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              <StatusDot
                status={openSessions > 0 ? 'online' : 'offline'}
                label={`Подключений: ${openSessions}`}
              />

              <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
                Если подключений нет, подключи контроллер или Postman WebSocket к:
              </div>

              <code style={{ color: 'var(--ds-primary)', overflowWrap: 'anywhere' }}>
                {'ws://localhost:8090/ws/perco?controllerId=UUID_КОНТРОЛЛЕРА'}
              </code>
              </div>)}
        </Card>

        <Card
          title="Выбор контроллера"
          subtitle="Можно выбрать из сессий или ввести controllerId вручную"
        >
          <div style={{ display: 'grid', gap: 14 }}>
            <Select
              label="controllerId из открытых сессий"
              value={controllerId}
              onChange={(e) => setControllerId(e.target.value)}
              options={[
                { label: 'Не выбран', value: '' },...controllerOptions,
              ]}
            />

            <Input
              label="controllerId вручную"
              value={manualControllerId}
              onChange={(e) => setManualControllerId(e.target.value)}
              placeholder="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            />

            <div style={{ color: 'var(--ds-text-muted)', fontSize: 13 }}>
              Используется:{' '}
              <span style={{ color: 'var(--ds-text-soft)' }}>
                {getSelectedControllerId() || '—'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Параметры ИУ" subtitle="PERCo number/direction">
          <div style={{ display: 'grid', gap: 14 }}>
            <Input
              label="ИУ number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <Input
              label="Direction"
              type="number"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            />
          </div>
        </Card>
      </div>

      <Card title="Команды состояния и конфигурации">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(() => requestPercoState(requireControllerId()),
                'Команда get state отправлена',)
            }
          >
            Get state
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(() => requestPercoNet(requireControllerId()),
                'Команда get net отправлена',)
            }
          >
            Get net
          </Button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <Input
              label="Reader number"
              type="number"
              value={readerNumber}
              onChange={(e) => setReaderNumber(e.target.value)}
              style={{ width: 120 }}
            />

            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={() =>
                runAction(() =>
                    requestPercoReader(requireControllerId(),
                      Number(readerNumber),),
                  'Команда get reader отправлена',)
              }
            >
              Get reader
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <Input
              label="Exdev number"
              type="number"
              value={exdevNumber}
              onChange={(e) => setExdevNumber(e.target.value)}
              style={{ width: 120 }}
            />

            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={() =>
                runAction(() =>
                    requestPercoExdev(requireControllerId(),
                      Number(exdevNumber),),
                  'Команда get exdev отправлена',)
              }
            >
              Get exdev
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Ручное управление ИУ">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            disabled={actionLoading}
            onClick={() =>
              runAction(() =>
                  openPercoExdev(requireControllerId(),
                    Number(number),
                    Number(direction),),
                'Команда open отправлена',)
            }
          >
            Открыть
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(() =>
                  closePercoExdev(requireControllerId(),
                    Number(number),
                    Number(direction),),
                'Команда close отправлена',)
            }
          >
            Закрыть
          </Button>

          <Button
            variant="danger"
            disabled={actionLoading}
            onClick={() =>
              runAction(() =>
                  banPercoAccess(requireControllerId(),
                    Number(number),
                    Number(direction),),
                'Команда ban отправлена',)
            }
          >
            Запретить проход
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(() =>
                  setPercoAccessMode(requireControllerId(),
                    Number(number),
                    Number(direction),
                    'open',),
                'Режим open отправлен',)
            }
          >
            Access mode: open
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={() =>
              runAction(() =>
                  setPercoAccessMode(requireControllerId(),
                    Number(number),
                    Number(direction),
                    'control',),
                'Режим control отправлен',)
            }
          >
            Access mode: control
          </Button>
        </div>
      </Card>

      <Card title="Открытые PERCo-сессии">
        {loading? (<Loading />): (<DataTable
            data={sessions}
            getRowKey={(item) => item.sessionId}
            columns={[
              {
                key: 'session',
                title: 'Session ID',
                render: (item) => item.sessionId,
              },
              {
                key: 'open',
                title: 'Open',
                render: (item) => (<StatusDot status={item.open? 'online': 'offline'} />),
              },
              {
                key: 'controller',
                title: 'Controller ID',
                render: (item) => item.controllerId || '—',
              },
              {
                key: 'remote',
                title: 'Remote address',
                render: (item) => item.remoteAddress || '—',
              },
              {
                key: 'actions',
                title: 'Действие',
                render: (item) =>
                  item.controllerId? (<Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setControllerId(item.controllerId || '');
                        setManualControllerId('');
                      }}
                    >
                      Выбрать
                    </Button>): ('—'),
              },
            ]}
          />)}
      </Card>
    </div>);
}