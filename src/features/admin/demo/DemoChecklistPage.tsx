import { useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { PageHeader } from '../../../components/page/PageHeader';

interface ChecklistItem {
  id: string;
  group: string;
  title: string;
  description: string;
  route?: string;
}

const checklist: ChecklistItem[] = [
  {
    id: 'health',
    group: 'Старт',
    title: 'Проверить healthcheck',
    description: 'Открыть /admin/health и убедиться, что central/local доступны.',
    route: '/admin/health',
  },
  {
    id: 'login',
    group: 'Старт',
    title: 'Войти под admin',
    description: 'Проверить, что /api/auth/me возвращает permissions: ["*"].',
    route: '/central/login',
  },
  {
    id: 'org',
    group: 'Центральный сервер',
    title: 'Создать организацию',
    description: 'Создать, изменить и удалить тестовую организацию.',
    route: '/central/organizations',
  },
  {
    id: 'object',
    group: 'Центральный сервер',
    title: 'Создать объект',
    description: 'Создать объект охраны и связать с организацией.',
    route: '/central/objects',
  },
  {
    id: 'local-server',
    group: 'Центральный сервер',
    title: 'Создать локальный сервер',
    description: 'Создать local server с serverToken и проверить server_token_hash в БД.',
    route: '/central/local-servers',
  },
  {
    id: 'heartbeat',
    group: 'Синхронизация',
    title: 'Проверить heartbeat',
    description: 'Через /central/heartbeat-debug отправить heartbeat и убедиться, что status online.',
    route: '/central/heartbeat-debug',
  },
  {
    id: 'sync-config',
    group: 'Синхронизация',
    title: 'Проверить local-sync config',
    description: 'Получить конфигурацию для localServerId/token.',
    route: '/central/local-sync-config',
  },
  {
    id: 'controllers',
    group: 'Оборудование',
    title: 'Создать контроллер PERCo',
    description: 'Создать PERCo C01, считыватели и точки прохода.',
    route: '/central/controllers',
  },
  {
    id: 'persons',
    group: 'Доступ',
    title: 'Создать физическое лицо',
    description: 'Создать сотрудника и открыть карточку лица.',
    route: '/central/persons',
  },
  {
    id: 'identifier',
    group: 'Доступ',
    title: 'Привязать карту',
    description: 'Создать identifier или привязать карту через /central/card-binding.',
    route: '/central/card-binding',
  },
  {
    id: 'schedule',
    group: 'Доступ',
    title: 'Создать расписание',
    description: 'Создать расписание доступа.',
    route: '/central/schedules',
  },
  {
    id: 'rule',
    group: 'Доступ',
    title: 'Создать правило доступа',
    description: 'Связать person + accessPoint + schedule.',
    route: '/central/access-rules',
  },
  {
    id: 'access-check',
    group: 'Доступ',
    title: 'Проверить доступ',
    description: 'Выполнить access-check по карте и точке прохода.',
    route: '/central/access-check',
  },
  {
    id: 'local-arm',
    group: 'Локальный сервер',
    title: 'Открыть локальный АРМ',
    description: 'Проверить /local/operator, журнал, тревоги, manual control.',
    route: '/local/operator',
  },
  {
    id: 'perco',
    group: 'PERCo',
    title: 'Проверить PERCo C01',
    description: 'Открыть PERCo страницу и проверить mock/real события.',
    route: '/local/perco',
  },
  {
    id: 'guest',
    group: 'Гости',
    title: 'Создать гостевую заявку',
    description: 'Открыть публичную заявку, согласовать и зарегистрировать вход/выход.',
    route: '/public/guest-request',
  },
  {
    id: 'realtime',
    group: 'Realtime',
    title: 'Проверить realtime',
    description: 'Открыть /central/realtime и убедиться, что события приходят.',
    route: '/central/realtime',
  },
  {
    id: 'users',
    group: 'Администрирование',
    title: 'Проверить users/roles',
    description: 'Создать пользователя, роль, назначить permissions.',
    route: '/admin/users',
  },
];

export function DemoChecklistPage() {
  const [doneIds, setDoneIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('diamondshield_demo_done') || '[]');
    } catch {
      return [];
    }
  });

  function toggle(id: string) {
    setDoneIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      localStorage.setItem('diamondshield_demo_done', JSON.stringify(next));

      return next;
    });
  }

  function reset() {
    setDoneIds([]);
    localStorage.removeItem('diamondshield_demo_done');
  }

  const groups = Array.from(new Set(checklist.map((item) => item.group)));
  const progress = Math.round((doneIds.length / checklist.length) * 100);

  return (
    <div className="ds-page">
      <PageHeader
        title="Demo checklist"
        description="Финальный сценарий проверки MVP Diamond Shield"
        actions={
          <Button variant="secondary" onClick={reset}>
            Сбросить
          </Button>
        }
      />

      <div className="ds-grid ds-grid-3">
        <Card title="Прогресс">
          <div style={{ fontSize: 34, fontWeight: 900 }}>{progress}%</div>
          <div style={{ color: 'var(--ds-text-muted)' }}>
            {doneIds.length} / {checklist.length}
          </div>
        </Card>

        <Card title="Статус">
          <Badge tone={progress === 100 ? 'success' : 'warning'}>
            {progress === 100 ? 'MVP проверен' : 'Проверка не завершена'}
          </Badge>
        </Card>

        <Card title="Важно">
          <div style={{ color: 'var(--ds-text-soft)' }}>
            Если пункт не проходит — сначала смотри backend логи и Network в браузере.
          </div>
        </Card>
      </div>

      {groups.map((group) => {
        const groupItems = checklist.filter((item) => item.group === group);

        return (
          <Card key={group} title={group}>
            <div style={{ display: 'grid', gap: 12 }}>
              {groupItems.map((item) => {
                const done = doneIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px minmax(0, 1fr) auto',
                      gap: 12,
                      alignItems: 'start',
                      padding: 12,
                      border: '1px solid var(--ds-border)',
                      borderRadius: 12,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(item.id)}
                      style={{ marginTop: 4 }}
                    />

                    <div>
                      <div style={{ fontWeight: 800 }}>{item.title}</div>
                      <div
                        style={{
                          marginTop: 4,
                          color: 'var(--ds-text-muted)',
                          fontSize: 13,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>

                    {item.route && (
                      <a href={item.route}>
                        <Button size="sm" variant="secondary">
                          Открыть
                        </Button>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}