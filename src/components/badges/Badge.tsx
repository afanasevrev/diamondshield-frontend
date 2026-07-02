import { type ReactNode } from 'react';
import { classNames } from '../../shared/utils/classNames';
import './Badge.css';

interface BadgeProps {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'muted' | 'info';
  children: ReactNode;
}

export function Badge({ tone = 'default', children }: BadgeProps) {
  return (
    <span className={classNames('ds-badge', `ds-badge-${tone}`)}>
      {children}
    </span>
  );
}