import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'cyan' | 'red' | 'amber' | 'emerald' | 'purple';
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'cyan'
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'red':
        return {
          iconBg: 'rgba(239, 68, 68, 0.12)',
          iconColor: '#f87171'
        };
      case 'amber':
        return {
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: '#fbbf24'
        };
      case 'emerald':
        return {
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: '#34d399'
        };
      case 'purple':
        return {
          iconBg: 'rgba(168, 85, 247, 0.12)',
          iconColor: '#c084fc'
        };
      case 'cyan':
      default:
        return {
          iconBg: 'rgba(56, 189, 248, 0.12)',
          iconColor: '#38bdf8'
        };
    }
  };

  const accents = getAccentStyles();

  return (
    <div 
      className="cyber-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '128px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            {value}
          </div>
        </div>
        <div 
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: accents.iconBg,
            color: accents.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        {trend && (
          <span 
            style={{ 
              fontWeight: 600, 
              color: trend.isPositive ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {trend.value}
          </span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>
          {subtitle || (trend?.label && `${trend.label}`)}
        </span>
      </div>
    </div>
  );
};
