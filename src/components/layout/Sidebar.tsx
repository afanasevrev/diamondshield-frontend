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
  { label: 'Организации', to: '/central/organizations', permissions: ['ORGANIZATION_READ'] },
  { label: 'Объекты', to: '/central/objects', permissions: ['OBJECT_READ'] },
  { label: 'Локальные серверы', to: '/central/local-servers', permissions: ['LOCAL_SERVER_READ'] },
  { label: 'Диагностика offline', to: '/central/offline-diagnostics', permissions: ['LOCAL_SERVER_READ'] },
  { label: 'Heartbeat debug', to: '/central/heartbeat-debug', permissions: ['LOCAL_SERVER_DEBUG'] },
  { label: 'Local-sync config', to: '/central/local-sync-config', permissions: ['LOCAL_SYNC_READ'] },
  { label: 'Контроллеры', to: '/central/controllers', permissions: ['CONTROLLER_READ'] },
  { label: 'Считыватели', to: '/central/readers', permissions: ['READER_READ'] },
  { label: 'Точки прохода', to: '/central/access-points', permissions: ['ACCESS_POINT_READ'] },
  { label: 'Физические лица', to: '/central/persons', permissions: ['PERSON_READ'] },
  { label: 'Карточка лица', to: '/central/person-card', permissions: ['PERSON_READ'] },
  { label: 'Идентификаторы', to: '/central/identifiers', permissions: ['IDENTIFIER_READ'] },
  { label: 'Привязка карты', to: '/central/card-binding', permissions: ['IDENTIFIER_CREATE'] },
  { label: 'Импорт XLSX', to: '/central/imports', permissions: ['IMPORT_PERSONS'] },
  { label: 'Гостевые заявки', to: '/central/guest-requests', permissions: ['GUEST_REQUEST_READ'] },
  { label: 'Реестр гостей', to: '/central/guests', permissions: ['GUEST_READ'] },
  { label: 'Нежелательные гости', to: '/central/guest-blacklist', permissions: ['GUEST_BLACKLIST_READ'] },
  { label: 'Расписания', to: '/central/schedules', permissions: ['SCHEDULE_READ'] },
  { label: 'Правила доступа', to: '/central/access-rules', permissions: ['ACCESS_RULE_READ'] },
  { label: 'Проверка доступа', to: '/central/access-check', permissions: ['ACCESS_CHECK'] },
  { label: 'Журнал событий', to: '/central/access-events', permissions: ['ACCESS_EVENT_READ'] },
  { label: 'Центральные тревоги', to: '/central/alarms', permissions: ['ALARM_EVENT_READ'] },
  { label: 'История синхронизации', to: '/central/sync-history', permissions: ['SYNC_HISTORY_READ'] },
  { label: 'Аудит', to: '/central/audit', permissions: ['AUDIT_READ'] },
];

const localItems: NavItem[] = [
  { label: 'АРМ оператора', to: '/local/operator' },
  { label: 'Гостевой пост', to: '/local/guest-desk', permissions: ['GUEST_READ'] },
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
  { label: 'Пользователи', to: '/admin/users', permissions: ['USER_READ'] },
  { label: 'Роли', to: '/admin/roles', permissions: ['ROLE_READ'] },
  { label: 'Permissions', to: '/admin/permissions', permissions: ['PERMISSION_READ'] },
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