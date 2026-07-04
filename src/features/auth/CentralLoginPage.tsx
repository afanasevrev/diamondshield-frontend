import { type SubmitEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/buttons/Button';
import { Card } from '../../components/cards/Card';
import { ErrorMessage } from '../../components/feedback/ErrorMessage';
import { Input } from '../../components/forms/Input';
import { useAuth } from '../../app/providers/AuthProvider';
import './LoginPage.css';

export function CentralLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (auth.isAuthenticated) {
    return <Navigate to="/central/dashboard" replace />;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await auth.login(username, password);

      navigate('/central/dashboard');
    } catch (ex) {
      setError(
        ex instanceof Error
          ? ex.message
          : 'Не удалось выполнить вход в центральный сервер',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ds-login-page ds-crystal-bg">
      <div className="ds-login-panel">
        <div className="ds-login-brand">
          <div className="ds-login-logo">DS</div>

          <div>
            <h1>Diamond Shield</h1>
            <p>Центральный сервер СКУД</p>
          </div>
        </div>

        <Card title="Вход в центральный сервер" subtitle="JWT Bearer token">
          <form className="ds-login-form" onSubmit={handleSubmit}>
            {error && <ErrorMessage message={error} />}

            <Input
              label="Логин"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />

            <Input
              label="Пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin"
              type="password"
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}