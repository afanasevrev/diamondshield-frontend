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
  { label: 'Контроллеры', to: '/central/controllers' },
  { label: 'Считыватели', to: '/central/readers' },
  { label: 'Точки прохода', to: '/central/access-points' },
  { label: 'Физические лица', to: '/central/persons' },
  { label: 'Идентификаторы', to: '/central/identifiers' },
  { label: 'Расписания', to: '/central/schedules' },
  { label: 'Правила доступа', to: '/central/access-rules' },
  { label: 'Проверка доступа', to: '/central/access-check' },
  { label: 'Журнал событий', to: '/central/access-events' },
];

const localItems: NavItem[] = [
  { label: 'АРМ оператора', to: '/local/operator' },
  { label: 'PERCo C01', to: '/local/perco' },
  { label: 'Журнал проходов', to: '/local/access-events' },
  { label: 'Фоторяд', to: '/local/photo-line' },
  { label: 'Тревоги', to: '/local/alarms' },
  { label: 'Точки доступа', to: '/local/access-points' },
  { label: 'Контроллеры', to: '/local/controllers' },
  { label: 'Диагностика', to: '/local/diagnostics' },
  { label: 'Синхронизация', to: '/local/sync' },
];

export function Sidebar() {
  return (
    <aside className="ds-sidebar">
      <div className="ds-sidebar-logo">
        <div className="ds-sidebar-logo-mark">DS</div>

        <div className="ds-sidebar-logo-text">
          <span className="ds-sidebar-logo-title">Diamond Shield</span>
          <span className="ds-sidebar-logo-subtitle">СКУД</span>
        </div>
      </div>

      <div className="ds-sidebar-section">
        <div className="ds-sidebar-section-title">Центральный сервер</div>

        <nav className="ds-sidebar-nav">
          {centralItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="ds-sidebar-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="ds-sidebar-section">
        <div className="ds-sidebar-section-title">Локальный сервер</div>

        <nav className="ds-sidebar-nav">
          {localItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="ds-sidebar-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}