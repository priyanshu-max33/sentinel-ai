import type { FC } from 'react';
import type { RiskLevel } from '../types';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const RiskBadge: FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'sm' }) => {
  const getIcon = () => {
    switch (level) {
      case 'CRITICAL':
        return <Flame size={size === 'sm' ? 12 : 14} />;
      case 'HIGH':
        return <ShieldAlert size={size === 'sm' ? 12 : 14} />;
      case 'MEDIUM':
        return <AlertTriangle size={size === 'sm' ? 12 : 14} />;
      case 'LOW':
        return <Info size={size === 'sm' ? 12 : 14} />;
      case 'SAFE':
        return <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
    }
  };

  return (
    <span className={`risk-badge risk-${level}`} style={{ fontSize: size === 'sm' ? '11px' : '12px' }}>
      {showIcon && getIcon()}
      {level}
    </span>
  );
};
