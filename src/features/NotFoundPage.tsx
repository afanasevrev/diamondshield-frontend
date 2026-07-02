import { Link } from 'react-router-dom';
import { Button } from '../components/buttons/Button';
import { Card } from '../components/cards/Card';

export function NotFoundPage() {
  return (
    <div className="ds-page">
      <Card title="Страница не найдена" subtitle="404">
        <p style={{ color: 'var(--ds-text-muted)' }}>
          Запрошенный раздел пока не реализован или указан неверный адрес.
        </p>

        <Link to="/central/dashboard">
          <Button>На главную</Button>
        </Link>
      </Card>
    </div>
  );
}