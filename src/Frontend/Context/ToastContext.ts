import { createContext, useContext } from 'react';

export type ToastTone = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export interface ToastValue {
  notify: (message: string, tone?: ToastTone) => void;
}

export const ToastContext = createContext<ToastValue | null>(null);

export function useToast() {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error('useToast has to be used inside a ToastProvider.');
  }

  return value;
}
