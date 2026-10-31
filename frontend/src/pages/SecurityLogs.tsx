import { useState } from 'react';
import type { FC } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';
import { SecurityEvent } from '../components/SecurityEvent';
import { EmptyState } from '../components/EmptyState';
import { useSecurityData } from '../hooks/useSecurityData';

export const SecurityLogs: FC<{ securityData: ReturnType<typeof useSecurityData> }> = ({ securityData }) => {
  const { events, refreshData } = securityData;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVector, setSelectedVector] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.payloadSample.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVector = selectedVector === 'ALL' || evt.vector === selectedVector;
    const matchesSeverity = selectedSeverity === 'ALL' || evt.severity === selectedSeverity;

    return matchesSearch && matchesVector && matchesSeverity;
  });

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />
            Security Audit Trail & Incident Logs (Mock Mode)
          </h2>
          <p className="page-subtitle">
            Awaiting backend <code>/api/events</code>. Displays simulated timeline of prompt injection interceptions and analyst decisions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportJSON}>
            <Download size={13} /> Export JSON Audit
          </button>
          <button className="btn btn-secondary btn-sm" onClick={refreshData}>
            <RotateCcw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by event title, pattern, source file, or payload string..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Vector Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Vector:</span>
            {['ALL', 'EMAIL', 'WEB', 'PDF', 'DIRECT_PROMPT'].map((vec) => (
              <button
                key={vec}
                onClick={() => setSelectedVector(vec)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: selectedVector === vec ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: selectedVector === vec ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: selectedVector === vec ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {vec}
              </button>
            ))}
          </div>

          {/* Severity Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: selectedSeverity === sev ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: selectedSeverity === sev ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  color: selectedSeverity === sev ? '#f87171' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="cyber-card">
          <EmptyState 
            title="No Matching Security Incidents"
            description="No logged events meet the current search or filter criteria. Try broadening your filter."
            icon={ShieldCheck}
          />
        </div>
      ) : (
        <div>
          {filteredEvents.map((evt) => (
            <SecurityEvent key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
};
