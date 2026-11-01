import { useState } from 'react';
import type { FC, MouseEvent } from 'react';
import type { SecurityEventItem } from '../types';
import { RiskBadge } from './RiskBadge';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, Copy, Check, Terminal } from 'lucide-react';

interface SecurityEventProps {
  event: SecurityEventItem;
}

export const SecurityEvent: FC<SecurityEventProps> = ({ event }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(event.payloadSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVectorColor = (vector: string) => {
    switch (vector) {
      case 'EMAIL':
        return '#38bdf8';
      case 'WEB':
        return '#a855f7';
      case 'PDF':
        return '#f59e0b';
      default:
        return '#818cf8';
    }
  };

  return (
    <div 
      className="cyber-card" 
      style={{
        marginBottom: '12px',
        padding: '16px 20px',
        borderLeft: event.blocked ? '3px solid #ef4444' : '3px solid #10b981',
        cursor: 'pointer'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              background: event.blocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: event.blocked ? '#f87171' : '#34d399'
            }}
          >
            {event.blocked ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                {event.title}
              </span>
              <RiskBadge level={event.severity} />
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: getVectorColor(event.vector),
                  border: `1px solid ${getVectorColor(event.vector)}40`
                }}
              >
                {event.vector}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{event.source}</span> • {event.timestamp}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: event.blocked ? '#f87171' : '#34d399'
            }}
          >
            {event.blocked ? 'ENFORCED: BLOCKED' : 'PERMITTED: SAFE'}
          </span>
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px' }}>
        {event.description}
      </div>

      {expanded && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} /> ADVERSARIAL PAYLOAD SNIPPET / INJECTION TRACE:
            </span>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleCopy}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy Payload'}
            </button>
          </div>

          <div className="code-box">
            {event.payloadSample}
          </div>

          <div 
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '12px',
              color: '#bae6fd'
            }}
          >
            <strong>Deterministic Mitigation Applied:</strong> {event.mitigation}
          </div>
        </div>
      )}
    </div>
  );
};
