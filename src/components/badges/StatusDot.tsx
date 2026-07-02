import { classNames } from '../../shared/utils/classNames';
import './Badge.css';

interface StatusDotProps {
  status?: string | null;
  label?: string;
}

function statusToTone(status?: string | null): string {
  if (!status) {
    return 'muted';
  }

  const normalized = status.toLowerCase();

  if (['online', 'active', 'ok', 'success', 'allowed'].includes(normalized)) {
    return 'success';
  }

  if (['warning', 'partial', 'processing'].includes(normalized)) {
    return 'warning';
  }

  if (['error', 'offline', 'denied', 'critical', 'high'].includes(normalized)) {
    return 'danger';
  }

  return 'muted';
}

export function StatusDot({ status, label }: StatusDotProps) {
  const tone = statusToTone(status);

  return (
    <span className="ds-status-dot-wrap">
      <span className={classNames('ds-status-dot', `ds-status-dot-${tone}`)} />
      <span>{label || status || 'unknown'}</span>
    </span>
  );
}