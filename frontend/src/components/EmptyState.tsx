import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = ShieldCheck,
  action
}) => {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <div style={{ marginTop: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={action.onClick}>
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};
