import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import './ToastNotification.css';

export default function ToastNotification({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast-bubble">
        <CheckCircle2 size={20} className="toast-icon" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#ffffff', marginTop: '2px' }}>
            {toast.message}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f1f3f5',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
