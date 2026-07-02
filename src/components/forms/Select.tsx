import { type SelectHTMLAttributes } from 'react';
import { type SelectOption } from '../../shared/types/common';
import './Form.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({ label, error, options, ...props }: SelectProps) {
  return (
    <label className="ds-field">
      {label && <span className="ds-field-label">{label}</span>}

      <select className="ds-input" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="ds-field-error">{error}</span>}
    </label>
  );
}