import { type SubmitEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/buttons/Button';
import { Card } from '../../components/cards/Card';
import { Input } from '../../components/forms/Input';
import { useAuth } from '../../app/providers/AuthProvider';
import './LoginPage.css';

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  if (auth.isAuthenticated) {
    return <Navigate to="/central/dashboard" replace />;
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    auth.login(username, password);
    navigate('/central/dashboard');
  }

  return (
    <div className="ds-login-page ds-crystal-bg">
      <div className="ds-login-panel">
        <div className="ds-login-brand">
          <div className="ds-login-logo">DS</div>
          <div>
            <h1>Diamond Shield</h1>
            <p>Система контроля и управления доступом</p>
          </div>
        </div>

        <Card title="Вход в систему" subtitle="MVP-режим авторизации">
          <form className="ds-login-form" onSubmit={handleSubmit}>
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

            <Button type="submit">Войти</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}