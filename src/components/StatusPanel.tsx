import { AlertTriangle, SearchX } from 'lucide-react';

interface StatusPanelProps {
  kind: 'error' | 'empty';
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function StatusPanel({ kind, title, message, action }: StatusPanelProps) {
  const Icon = kind === 'error' ? AlertTriangle : SearchX;
  return (
    <section className="status-panel" role={kind === 'error' ? 'alert' : 'status'}>
      <Icon aria-hidden="true" size={30} />
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? (
        <button type="button" className="hex-button" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </section>
  );
}
