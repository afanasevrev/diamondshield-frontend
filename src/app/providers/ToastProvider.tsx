import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import './ToastProvider.css';

type ToastTone = 'success' | 'warning' | 'danger' | 'info';

interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  function showToast(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();

    setItems((prev) => [
      ...prev,
      {
        id,
        ...toast,
      },
    ]);

    window.setTimeout(() => {
      removeToast(id);
    }, 6000);
  }

  function removeToast(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="ds-toast-container">
        {items.map((item) => (
          <div key={item.id} className={`ds-toast ds-toast-${item.tone}`}>
            <button
              type="button"
              className="ds-toast-close"
              onClick={() => removeToast(item.id)}
            >
              ×
            </button>

            <div className="ds-toast-title">{item.title}</div>

            {item.message && (
              <div className="ds-toast-message">{item.message}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}