import type { FC } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  Mail, 
  Zap,
  Lock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { SecurityEvent } from '../components/SecurityEvent';
import { ApprovalCard } from '../components/ApprovalCard';
import { useSecurityData } from '../hooks/useSecurityData';
import type { NavPage } from '../components/Sidebar';

interface DashboardProps {
  onNavigate: (page: NavPage) => void;
  securityData: ReturnType<typeof useSecurityData>;
}

export const Dashboard: FC<DashboardProps> = ({ onNavigate, securityData }) => {
  const { stats, approvals, events, handleApproval } = securityData;

  const topApprovals = approvals.slice(0, 2);
  const recentEvents = events.slice(0, 4);

  return (
    <div className="page-wrapper">
      {/* Dual-Plane Architectural Concept Banner */}
      <div className="security-barrier-banner">
        <div>
          <div className="security-barrier-title">
            <Lock size={16} /> SENTINEL DUAL-PLANE SECURITY ENGINE
          </div>
          <div className="security-barrier-text">
            LLMs propose actions from untrusted inputs (Email, Web, PDF). The deterministic policy engine validates and authorizes every call before execution.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('email-scanner')}>
            <Mail size={13} /> Test Email Ingestion
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('approvals')}>
            Inspect Queue ({approvals.length})
          </button>
        </div>
      </div>

      {/* Mock Mode Notice Banner */}
      <div 
        style={{
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}
      >
        <span>
          <strong style={{ color: 'var(--text-secondary)' }}>Status:</strong> Telemetry metrics below are running in <span style={{ color: 'var(--accent-cyan)' }}>Simulated Mock Mode</span> until backend <code>/api/events</code> and <code>/api/approvals</code> are confirmed.
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          Active Real Endpoint: POST /api/actions/check
        </span>
      </div>

      {/* Top Telemetry Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard 
          title="Total Inputs Scanned"
          value={stats?.totalScanned.toLocaleString() || '1,429'}
          subtitle="Simulated telemetry metric"
          icon={Activity}
          trend={{ value: '+14.2%', isPositive: true, label: 'vs last 24h' }}
          accentColor="cyan"
        />

        <StatCard 
          title="Injections Blocked"
          value={stats?.injectionsBlocked.toLocaleString() || '284'}
          subtitle="Simulated payload count"
          icon={ShieldAlert}
          trend={{ value: '+28 new', isPositive: false, label: 'threat spike' }}
          accentColor="red"
        />

        <StatCard 
          title="Pending Approvals"
          value={approvals.length}
          subtitle="Mock authorization queue"
          icon={AlertTriangle}
          trend={{ value: `${approvals.length} urgent`, isPositive: approvals.length === 0, label: 'Human-in-the-Loop' }}
          accentColor="amber"
        />

        <StatCard 
          title="Safe Actions Authorized"
          value={stats?.safeActionsExecuted.toLocaleString() || '1,142'}
          subtitle="Zero false-positive disruption"
          icon={ShieldCheck}
          trend={{ value: '99.4%', isPositive: true, label: 'system uptime' }}
          accentColor="emerald"
        />
      </div>

      {/* Real-time Visualizations Grid */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Time-Series Area Chart: Allowed vs Blocked */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
              24-Hour Threat Detection & Authorization Velocity
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simulated Telemetry</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.timeSeriesData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0e1a', 
                    borderColor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '8px',
                    fontSize: '12px' 
                  }} 
                />
                <Area type="monotone" dataKey="allowed" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorAllowed)" name="Authorized Actions" />
                <Area type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" name="Injections Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Authorized Actions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Injections Blocked</span>
            </div>
          </div>
        </div>

        {/* Vector Breakdown Chart */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Zap size={16} style={{ color: '#a855f7' }} />
              Attack Vector Vulnerability Distribution
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email vs Web vs PDF</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.vectorBreakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0e1a', 
                    borderColor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '8px',
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="count" fill="#1e293b" radius={[4, 4, 0, 0]} name="Total Ingested" />
                <Bar dataKey="blocked" fill="#ef4444" radius={[4, 4, 0, 0]} name="Injections Isolated" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: '#1e293b', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Total Ingested</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Injections Isolated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Pending Human-in-the-Loop Approvals */}
      {topApprovals.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
              Immediate Action Required: Human-in-the-Loop Queue (Mock Mode)
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('approvals')}
            >
              View All ({approvals.length}) <ArrowUpRight size={13} />
            </button>
          </div>

          {topApprovals.map((action) => (
            <ApprovalCard 
              key={action.id} 
              action={action} 
              onApprove={(id, notes) => handleApproval(id, 'APPROVE', notes)}
              onReject={(id, notes) => handleApproval(id, 'REJECT', notes)}
            />
          ))}
        </div>
      )}

      {/* Recent Security Incidents Stream */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--accent-cyan)' }} />
            Recent Security Interceptions & Policy Audit (Mock Mode)
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('logs')}
          >
            Full Audit Logs <ArrowUpRight size={13} />
          </button>
        </div>

        {recentEvents.map((evt) => (
          <SecurityEvent key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
};
