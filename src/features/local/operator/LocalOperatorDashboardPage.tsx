import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PageHeader } from '../../../components/page/PageHeader';

export function LocalOperatorDashboardPage() {
  return (
    <div className="ds-page">
      <PageHeader
        title="АРМ оператора объекта"
        description="Оперативный мониторинг проходов, тревог и оборудования"
        actions={
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Обновить
          </Button>
        }
      />

      <div className="ds-grid ds-grid-3">
        <Card title="Фоторяд" subtitle="Последние проходы">
          <EmptyState
            title="Пока нет событий"
            description="После подключения WebSocket здесь появится фоторяд проходящих пользователей."
          />
        </Card>

        <Card title="Тревоги" subtitle="Активные тревожные события">
          <EmptyState
            title="Нет активных тревог"
            description="События PERCo break, fire alarm и long open будут отображаться здесь."
          />
        </Card>

        <Card title="Связь" subtitle="Состояние локального сервера">
          <EmptyState
            title="Диагностика доступна отдельно"
            description="Перейдите в раздел «Диагностика» для проверки локального сервера."
          />
        </Card>
      </div>

      <Card title="Журнал проходов объекта" subtitle="MVP-заглушка этапа 1">
        <EmptyState
          title="Журнал будет подключен на этапе 6"
          description="После добавления API журнала и WebSocket события будут отображаться в реальном времени."
        />
      </Card>
    </div>
  );
}