import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';

interface NavItem {
  label: string;
  to: string;
  permissions?: string[];
}

const centralItems: NavItem[] = [
  { label: 'Панель мониторинга', to: '/central/dashboard' },
  { label: 'Организации', to: '/central/organizations', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Объекты', to: '/central/objects', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Локальные серверы', to: '/central/local-servers', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Диагностика offline', to: '/central/offline-diagnostics', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Heartbeat debug', to: '/central/heartbeat-debug', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Local-sync config', to: '/central/local-sync-config', permissions: ['LOCAL_MONITORING_VIEW'] },
  { label: 'Контроллеры', to: '/central/controllers', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Считыватели', to: '/central/readers', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Точки прохода', to: '/central/access-points', permissions: ['ORGANIZATION_VIEW'] },
  { label: 'Физические лица', to: '/central/persons', permissions: ['PERSON_VIEW'] },
  { label: 'Карточка лица', to: '/central/person-card', permissions: ['PERSON_VIEW'] },
  { label: 'Идентификаторы', to: '/central/identifiers', permissions: ['IDENTIFIER_VIEW'] },
  { label: 'Привязка карты', to: '/central/card-binding', permissions: ['IDENTIFIER_MANAGE'] },
  { label: 'Импорт XLSX', to: '/central/imports', permissions: ['PERSON_IMPORT'] },
  { label: 'Гостевые заявки', to: '/central/guest-requests', permissions: ['GUEST_REQUEST_VIEW'] },
  { label: 'Реестр гостей', to: '/central/guests', permissions: ['GUEST_VIEW'] },
  { label: 'Нежелательные гости', to: '/central/guest-blacklist', permissions: ['GUEST_BLACKLIST_VIEW'] },
  { label: 'Расписания', to: '/central/schedules', permissions: ['SCHEDULE_VIEW'] },
  { label: 'Правила доступа', to: '/central/access-rules', permissions: ['ACCESS_RULE_VIEW'] },
  { label: 'Проверка доступа', to: '/central/access-check', permissions: ['ACCESS_CHECK'] },
  { label: 'Журнал событий', to: '/central/access-events', permissions: ['ACCESS_EVENT_VIEW'] },
  { label: 'Центральные тревоги', to: '/central/alarms', permissions: ['ALARM_EVENT_VIEW'] },
  { label: 'История синхронизации', to: '/central/sync-history', permissions: ['SYNC_VIEW'] },
  { label: 'Аудит', to: '/central/audit', permissions: ['AUDIT_VIEW'] },
  { label: 'Realtime', to: '/central/realtime', permissions: ['REALTIME_VIEW'] },
  { label: 'Live проходы', to: '/central/live-access-events', permissions: ['REALTIME_VIEW'] },
  { label: 'Live тревоги', to: '/central/live-alarms', permissions: ['REALTIME_VIEW'] },
  { label: 'Live оборудование', to: '/central/live-device-status', permissions: ['REALTIME_VIEW'] },
  { label: 'Live гости', to: '/central/live-guests', permissions: ['REALTIME_VIEW'] },
];

const localItems: NavItem[] = [
  { label: 'АРМ оператора', to: '/local/operator' },
  { label: 'Гостевой пост', to: '/local/guest-desk', permissions: ['GUEST_VIEW'] },
  { label: 'Фоторяд', to: '/local/photo-line' },
  { label: 'Журнал проходов', to: '/local/access-events' },
  { label: 'Тревоги', to: '/local/alarms' },
  { label: 'Состояние оборудования', to: '/local/device-status' },
  { label: 'Ручное управление', to: '/local/manual-control' },
  { label: 'Точки доступа', to: '/local/access-points' },
  { label: 'Контроллеры', to: '/local/controllers' },
  { label: 'PERCo C01', to: '/local/perco' },
  { label: 'Диагностика', to: '/local/diagnostics' },
];

const adminItems: NavItem[] = [
  { label: 'Пользователи', to: '/admin/users', permissions: ['USER_VIEW'] },
  { label: 'Роли', to: '/admin/roles', permissions: ['ROLE_VIEW'] },
  { label: 'Permissions', to: '/admin/permissions', permissions: ['PERMISSION_VIEW'] },
  { label: 'Настройки', to: '/admin/settings', permissions: ['ADMIN_SETTINGS'] },
  { label: 'Healthcheck', to: '/admin/health', permissions: ['ADMIN_SETTINGS'] },
  { label: 'Env config', to: '/admin/env', permissions: ['ADMIN_SETTINGS'] },
  { label: 'Demo checklist', to: '/admin/demo-checklist', permissions: ['ADMIN_SETTINGS'] },
];

export function Sidebar() {
  const [centralOpen, setCentralOpen] = useState(true);
  const [localOpen, setLocalOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);

  const auth = useAuth();

  function filterItems(items: NavItem[]) {
    return items.filter((item) => {
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }

      return auth.hasAnyPermission(item.permissions);
    });
  }

  return (
    <aside className="ds-sidebar">
      <div className="ds-sidebar-logo">
        <div className="ds-sidebar-logo-mark">DS</div>

        <div className="ds-sidebar-logo-text">
          <span className="ds-sidebar-logo-title">Diamond Shield</span>
          <span className="ds-sidebar-logo-subtitle">СКУД</span>
        </div>
      </div>

      <SidebarSection
        title="Центральный сервер"
        open={centralOpen}
        onToggle={() => setCentralOpen((value) => !value)}
        items={filterItems(centralItems)}
      />

      <SidebarSection
        title="Локальный сервер"
        open={localOpen}
        onToggle={() => setLocalOpen((value) => !value)}
        items={filterItems(localItems)}
      />

      <SidebarSection
        title="Администрирование"
        open={adminOpen}
        onToggle={() => setAdminOpen((value) => !value)}
        items={filterItems(adminItems)}
      />
    </aside>
  );
}

function SidebarSection({
  title,
  open,
  onToggle,
  items,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  items: NavItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ds-sidebar-section">
      <button
        type="button"
        className="ds-sidebar-section-button"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="ds-sidebar-section-arrow">{open ? '▲' : '▼'}</span>
      </button>

      <nav className={open ? 'ds-sidebar-nav' : 'ds-sidebar-nav-collapsed'}>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="ds-sidebar-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}