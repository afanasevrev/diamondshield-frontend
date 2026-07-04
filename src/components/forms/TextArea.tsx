import { type TextareaHTMLAttributes } from 'react';
import './Form.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, ...props }: TextAreaProps) {
  return (
    <label className="ds-field">
      {label && <span className="ds-field-label">{label}</span>}
      <textarea className="ds-input ds-textarea" {...props} />
      {error && <span className="ds-field-error">{error}</span>}
    </label>
  );
}