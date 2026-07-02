import './Feedback.css';

export function Loading() {
  return (
    <div className="ds-feedback">
      <div className="ds-spinner" />
      <span>Загрузка данных...</span>
    </div>
  );
}