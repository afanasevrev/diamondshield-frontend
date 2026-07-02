import { useLocation } from 'react-router-dom';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';
import { useAuth } from '../../app/providers/AuthProvider';

function getMode(pathname: string): string {
  if (pathname.startsWith('/local')) {
    return 'Локальный сервер объекта';
  }

  if (pathname.startsWith('/central')) {
    return 'Центральный сервер';
  }

  return 'Diamond Shield';
}

export function Topbar() {
  const location = useLocation();
  const auth = useAuth();

  return (
    <header className="ds-topbar">
      <div className="ds-topbar-title">
        <strong>{getMode(location.pathname)}</strong>
        <span>Единый интерфейс мониторинга и управления СКУД</span>
      </div>

      <div className="ds-topbar-actions">
        <Badge tone="info">MVP</Badge>

        {auth.isAuthenticated && (
          <>
            <Badge tone="muted">{auth.username}</Badge>
            <Button variant="secondary" size="sm" onClick={auth.logout}>
              Выйти
            </Button>
          </>
        )}
      </div>
    </header>
  );
}