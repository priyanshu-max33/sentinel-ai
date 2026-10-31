import type { FC } from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'danger' | 'idle';
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status, label, pulse = true }) => {
  const getDotClass = () => {
    switch (status) {
      case 'active':
        return pulse ? 'status-dot active' : 'status-dot';
      case 'warning':
        return 'status-dot warning';
      case 'danger':
        return pulse ? 'status-dot danger' : 'status-dot';
      case 'idle':
      default:
        return 'status-dot';
    }
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
      <span className={getDotClass()} />
      {label && <span style={{ color: 'var(--text-secondary)' }}>{label}</span>}
    </span>
  );
};
