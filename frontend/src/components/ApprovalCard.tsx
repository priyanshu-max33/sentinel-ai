import { useState } from 'react';
import type { FC } from 'react';
import type { ProposedAction } from '../types';
import { RiskBadge } from './RiskBadge';
import { 
  Check, 
  X, 
  Bot, 
  Lock, 
  AlertOctagon, 
  ArrowRight, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

interface ApprovalCardProps {
  action: ProposedAction;
  onApprove: (actionId: string, notes?: string) => Promise<void>;
  onReject: (actionId: string, notes?: string) => Promise<void>;
}

export const ApprovalCard: FC<ApprovalCardProps> = ({ action, onApprove, onReject }) => {
  const [analystNotes, setAnalystNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const handleAction = async (decision: 'APPROVE' | 'REJECT') => {
    try {
      setIsSubmitting(true);
      if (decision === 'APPROVE') {
        await onApprove(action.id, analystNotes);
      } else {
        await onReject(action.id, analystNotes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="cyber-card" 
      style={{
        marginBottom: '20px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 4px 20px -2px rgba(239, 68, 68, 0.08)'
      }}
    >
      {/* Top Banner: Origin & Risk */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span 
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              fontWeight: 700,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertOctagon size={14} /> HUMAN-IN-THE-LOOP APPROVAL REQUIRED
          </span>
          <RiskBadge level={action.riskLevel} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{action.id}</span>
          </span>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Flagged {action.timestamp}
        </span>
      </div>

      {/* Untrusted Source Ingestion Context */}
      <div 
        style={{
          marginTop: '14px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <FileText size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Untrusted Source Vector:</span>
          <strong style={{ color: 'var(--text-main)' }}>{action.sourceContext.vector}</strong>
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{action.sourceContext.sourceName}</span>
        </div>

        {action.sourceContext.snippet && (
          <button 
            className="btn btn-secondary btn-sm"
            style={{ padding: '2px 8px', fontSize: '11px' }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Source Snippet' : 'Inspect Raw Ingestion'}
          </button>
        )}
      </div>

      {showDetails && action.sourceContext.snippet && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 600, marginBottom: '4px' }}>
            SUSPECTED INJECTION PAYLOAD DETECTED IN UNTRUSTED INPUT:
          </div>
          <div className="code-box" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
            {action.sourceContext.snippet}
          </div>
        </div>
      )}

      {/* Dual Plane Architecture Visualization */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          marginTop: '16px',
          alignItems: 'stretch'
        }}
      >
        {/* Left Box: AI Reasoning Plane (Untrusted) */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
            <Bot size={15} /> AI Reasoning Plane (Proposed Action)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
            Tool Request: <code style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{action.toolName}</code>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
            {action.reasoning}
          </p>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Proposed Tool Arguments:
          </div>
          <div className="code-box" style={{ maxHeight: '110px' }}>
            {JSON.stringify(action.parameters, null, 2)}
          </div>
        </div>

        {/* Center: Enforcement Barrier */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1e293b',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171'
            }}
          >
            <Lock size={16} />
          </div>
          <div style={{ width: '1px', flex: 1, background: 'rgba(239, 68, 68, 0.3)', margin: '6px 0' }} />
          <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Right Box: Deterministic Policy Engine (Trusted) */}
        <div 
          style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#f87171', marginBottom: '8px' }}>
            <ShieldAlert size={15} /> Deterministic Policy Engine (Trusted)
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fca5a5', marginBottom: '6px' }}>
            Policy Violation Triggered:
          </div>
          <div 
            style={{
              padding: '8px 10px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginBottom: '10px'
            }}
          >
            {action.policyViolation || 'UNAUTHORIZED_CROSS_BOUNDARY_CALL: Action exceeds autonomous trust ceiling.'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Target Resource: <strong style={{ color: '#fff' }}>{action.targetResource}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
            Execution is currently <strong>halted</strong>. Without analyst authorization, this tool call will be discarded and isolated.
          </div>
        </div>
      </div>

      {/* Analyst Decision Actions */}
      <div 
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Optional security review notes (e.g. 'False positive verified with user' or 'Quarantining adversary')"
            value={analystNotes}
            onChange={(e) => setAnalystNotes(e.target.value)}
            disabled={isSubmitting}
            style={{ height: '36px', fontSize: '12px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-danger" 
            onClick={() => handleAction('REJECT')}
            disabled={isSubmitting}
          >
            <X size={15} /> Block & Quarantine
          </button>
          <button 
            className="btn btn-success" 
            onClick={() => handleAction('APPROVE')}
            disabled={isSubmitting}
          >
            <Check size={15} /> Authorize Execution
          </button>
        </div>
      </div>
    </div>
  );
};
