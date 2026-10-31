import { useState } from 'react';
import type { FC } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertOctagon, 
  Filter, 
  RotateCcw
} from 'lucide-react';
import { ApprovalCard } from '../components/ApprovalCard';
import { EmptyState } from '../components/EmptyState';
import { useSecurityData } from '../hooks/useSecurityData';

export const Approvals: FC<{ securityData: ReturnType<typeof useSecurityData> }> = ({ securityData }) => {
  const { approvals, handleApproval, refreshData } = securityData;
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredApprovals = approvals.filter(item => {
    if (filterLevel === 'ALL') return true;
    return item.riskLevel === filterLevel;
  });

  const handleQuarantineAll = async () => {
    for (const item of approvals) {
      if (item.riskLevel === 'CRITICAL') {
        await handleApproval(item.id, 'REJECT', 'Batch quarantine initiated by analyst');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <CheckSquare size={22} style={{ color: 'var(--accent-cyan)' }} />
            Human-in-the-Loop Action Approvals (Mock Mode)
          </h2>
          <p className="page-subtitle">
            Awaiting backend <code>/api/approvals</code>. Interactive local approval simulation to demonstrate zero-trust gatekeeping.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {approvals.some(a => a.riskLevel === 'CRITICAL') && (
            <button 
              className="btn btn-danger btn-sm"
              onClick={handleQuarantineAll}
            >
              <AlertOctagon size={14} /> Quarantine All Critical
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={refreshData}>
            <RotateCcw size={13} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          padding: '10px 16px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}
      >
        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginRight: '6px' }}>Filter by Severity:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
          <button
            key={level}
            onClick={() => setFilterLevel(level)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: filterLevel === level ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
              background: filterLevel === level ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: filterLevel === level ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {level}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing {filteredApprovals.length} of {approvals.length} action proposals
        </span>
      </div>

      {/* Approval List */}
      {filteredApprovals.length === 0 ? (
        <div className="cyber-card">
          <EmptyState 
            title="Zero Pending Security Approvals"
            description="The deterministic policy engine has processed all tool invocations. No unauthorized actions are pending execution."
            icon={ShieldCheck}
          />
        </div>
      ) : (
        <div>
          {filteredApprovals.map((action) => (
            <ApprovalCard 
              key={action.id} 
              action={action} 
              onApprove={(id, notes) => handleApproval(id, 'APPROVE', notes)}
              onReject={(id, notes) => handleApproval(id, 'REJECT', notes)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
