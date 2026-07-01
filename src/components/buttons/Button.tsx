import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { classNames } from '../../shared/utils/classNames';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'ds-button',
        `ds-button-${variant}`,
        `ds-button-${size}`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}