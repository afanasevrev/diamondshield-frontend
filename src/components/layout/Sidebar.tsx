import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

const centralItems: NavItem[] = [
  { label: 'Панель мониторинга', to: '/central/dashboard' },
  { label: 'Организации', to: '/central/organizations' },
  { label: 'Объекты', to: '/central/objects' },
  { label: 'Локальные серверы', to: '/central/local-servers' },
  { label: 'Диагностика offline', to: '/central/offline-diagnostics' },
  { label: 'Heartbeat debug', to: '/central/heartbeat-debug' },
  { label: 'Local-sync config', to: '/central/local-sync-config' },
  { label: 'Контроллеры', to: '/central/controllers' },
  { label: 'Считыватели', to: '/central/readers' },
  { label: 'Точки прохода', to: '/central/access-points' },
  { label: 'Физические лица', to: '/central/persons' },
  { label: 'Карточка лица', to: '/central/person-card' },
  { label: 'Идентификаторы', to: '/central/identifiers' },
  { label: 'Привязка карты', to: '/central/card-binding' },
  { label: 'Импорт XLSX', to: '/central/imports' },
  { label: 'Гостевые заявки', to: '/central/guest-requests' },
  { label: 'Реестр гостей', to: '/central/guests' },
  { label: 'Нежелательные гости', to: '/central/guest-blacklist' },
  { label: 'Расписания', to: '/central/schedules' },
  { label: 'Правила доступа', to: '/central/access-rules' },
  { label: 'Проверка доступа', to: '/central/access-check' },
  { label: 'Журнал событий', to: '/central/access-events' },
  { label: 'Центральные тревоги', to: '/central/alarms' },
  { label: 'История синхронизации', to: '/central/sync-history' },
  { label: 'Аудит', to: '/central/audit' },
];

const localItems: NavItem[] = [
  { label: 'Гостевой пост', to: '/local/guest-desk' },
  { label: 'АРМ оператора', to: '/local/operator' },
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

export function Sidebar() {
  const [centralOpen, setCentralOpen] = useState(true);
  const [localOpen, setLocalOpen] = useState(true);

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
        items={centralItems}
      />

      <SidebarSection
        title="Локальный сервер"
        open={localOpen}
        onToggle={() => setLocalOpen((value) => !value)}
        items={localItems}
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