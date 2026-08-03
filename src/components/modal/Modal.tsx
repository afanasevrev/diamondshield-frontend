import { type ReactNode } from 'react';
import { Button } from '../buttons/Button';
import './Modal.css';

interface ModalProps {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  title,
  description,
  open,
  onClose,
  children,
  footer,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ds-modal-backdrop" role="presentation">
      <div className="ds-modal" role="dialog" aria-modal="true">
        <header className="ds-modal-header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </header>

        <div className="ds-modal-body">{children}</div>

        {footer && <footer className="ds-modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}