import { type InputHTMLAttributes } from 'react';
import './Form.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="ds-field">
      {label && <span className="ds-field-label">{label}</span>}
      <input className="ds-input" {...props} />
      {error && <span className="ds-field-error">{error}</span>}
    </label>
  );
}
