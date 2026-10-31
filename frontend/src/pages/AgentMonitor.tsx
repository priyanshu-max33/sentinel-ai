import { useState } from 'react';
import type { FC } from 'react';
import { 
  Cpu, 
  Bot, 
  PauseCircle, 
  PlayCircle, 
  RotateCcw
} from 'lucide-react';
import type { AgentSession, AttackVector } from '../types';
import { useSecurityData } from '../hooks/useSecurityData';
import type { NavPage } from '../components/Sidebar';

interface AgentMonitorProps {
  onNavigate: (page: NavPage) => void;
  securityData: ReturnType<typeof useSecurityData>;
}

export const AgentMonitor: FC<AgentMonitorProps> = ({ onNavigate, securityData }) => {
  const { sessions } = securityData;
  const [localSessions, setLocalSessions] = useState<AgentSession[]>(sessions);

  const handleToggleHalt = (sessionId: string) => {
    setLocalSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const isHalted = s.status === 'HALTED';
        return {
          ...s,
          status: isHalted ? 'ANALYZING' : 'HALTED'
        };
      }
      return s;
    }));
  };

  const getStatusColor = (status: AgentSession['status']) => {
    switch (status) {
      case 'ANALYZING':
        return '#38bdf8';
      case 'WAITING_APPROVAL':
        return '#fbbf24';
      case 'HALTED':
        return '#ef4444';
      case 'IDLE':
      default:
        return '#64748b';
    }
  };

  const getVectorIcon = (vector: AttackVector) => {
    switch (vector) {
      case 'EMAIL':
        return '📧 Email Pipeline';
      case 'WEB':
        return '🌐 Web Intelligence';
      case 'PDF':
        return '📄 Document Compliance';
      default:
        return '⚡ Direct Prompt';
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Cpu size={22} style={{ color: 'var(--accent-cyan)' }} />
            Active Agent Session Telemetry (Simulation Mode)
          </h2>
          <p className="page-subtitle">
            Awaiting backend <code>/api/tasks</code>. Currently displaying interactive simulated agent supervisors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setLocalSessions(prev => prev.map(s => ({ ...s, status: 'ANALYZING' })));
            }}
          >
            <RotateCcw size={13} /> Resume All
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => {
              setLocalSessions(prev => prev.map(s => ({ ...s, status: 'HALTED' })));
            }}
          >
            <PauseCircle size={13} /> Emergency Halt All
          </button>
        </div>
      </div>

      {/* Grid of Agent Session Cards */}
      <div className="grid-2">
        {localSessions.map((session) => {
          const isHalted = session.status === 'HALTED';
          const isWaiting = session.status === 'WAITING_APPROVAL';

          return (
            <div 
              key={session.id} 
              className="cyber-card"
              style={{
                borderColor: isHalted ? 'rgba(239, 68, 68, 0.4)' : isWaiting ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Agent Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--accent-cyan)'
                      }}
                    >
                      <Bot size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                        {session.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Session ID: {session.id} • Started {session.startedAt}
                      </div>
                    </div>
                  </div>

                  <span 
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: `${getStatusColor(session.status)}15`,
                      color: getStatusColor(session.status),
                      border: `1px solid ${getStatusColor(session.status)}40`
                    }}
                  >
                    {session.status}
                  </span>
                </div>

                {/* Current Task Description */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current Mission / Assignment:
                  </span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {session.currentTask}
                  </p>
                </div>

                {/* Untrusted Ingestion Source */}
                <div 
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#070a14',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Untrusted Input Stream:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{getVectorIcon(session.vector)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#f1f5f9', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
                    {session.untrustedInputSource}
                  </div>
                </div>

                {/* Risk Level & Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Risk Meter</div>
                    <div 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 700, 
                        color: session.riskScore > 70 ? '#ef4444' : session.riskScore > 30 ? '#f59e0b' : '#10b981',
                        marginTop: '2px'
                      }}
                    >
                      {session.riskScore}/100
                    </div>
                  </div>

                  <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Proposed</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
                      {session.actionsProposedCount}
                    </div>
                  </div>

                  <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blocked</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#f87171', marginTop: '2px' }}>
                      {session.actionsBlockedCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div 
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Heartbeat: {session.lastHeartbeat}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isWaiting && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('approvals')}
                    >
                      Resolve Approval
                    </button>
                  )}

                  <button 
                    className={`btn ${isHalted ? 'btn-success' : 'btn-danger'} btn-sm`}
                    onClick={() => handleToggleHalt(session.id)}
                  >
                    {isHalted ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
                    {isHalted ? 'Resume Session' : 'Halt Agent'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
