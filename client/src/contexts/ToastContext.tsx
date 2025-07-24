import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/admin/Toast';

interface ToastContextType {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, removeToast, success, error } = useToast();

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};