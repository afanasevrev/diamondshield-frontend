import { type ReactNode } from 'react';
import { classNames } from '../../shared/utils/classNames';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  className,
}: CardProps) {
  return (
    <section className={classNames('ds-card', className)}>
      {(title || subtitle || actions) && (
        <header className="ds-card-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="ds-card-actions">{actions}</div>}
        </header>
      )}

      <div className="ds-card-body">{children}</div>
    </section>
  );
}