import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Server,
  Radio
} from 'lucide-react';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
  isLoading: boolean;
  pendingCount: number;
  backendConnected?: boolean;
}

export const Header: FC<HeaderProps> = ({
  title,
  onRefresh,
  isLoading,
  pendingCount,
  backendConnected = false
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header 
      style={{
        height: '64px',
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Page Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.2px' }}>
          {title}
        </h1>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>|</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={12} style={{ color: 'var(--accent-cyan)' }} />
          Zero-Trust Boundary
        </span>
      </div>

      {/* Center / Right Telemetry Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend API Health Status Indicator */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            background: backendConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            color: backendConnected ? '#34d399' : '#fbbf24'
          }}
          title={backendConnected ? 'Connected to FastAPI backend on port 8000' : 'Backend offline. Using client simulation heuristics until backend starts.'}
        >
          <Server size={12} />
          <span style={{ fontWeight: 600 }}>
            {backendConnected ? 'FASTAPI BACKEND: ONLINE' : 'BACKEND: OFFLINE (MOCK MODE)'}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{time || 'LIVE'}</span>
        </div>

        {/* Refresh Telemetry Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isLoading}
          title="Poll GET /health and reload telemetry"
        >
          <RefreshCw size={13} className={isLoading ? 'spin-animation' : ''} />
          {isLoading ? 'Syncing...' : 'Sync'}
        </button>

        {/* Pending Alerts Pill */}
        {pendingCount > 0 && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-full)',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <ShieldAlert size={14} />
            <span>{pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </header>
  );
};
