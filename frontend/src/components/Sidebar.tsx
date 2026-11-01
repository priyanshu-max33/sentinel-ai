import type { FC } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Mail, 
  Globe, 
  FileCode, 
  CheckSquare, 
  FileText, 
  Sliders, 
  ShieldAlert
} from 'lucide-react';

export type NavPage = 
  | 'dashboard' 
  | 'agents' 
  | 'email-scanner' 
  | 'web-scanner' 
  | 'pdf-scanner' 
  | 'approvals' 
  | 'logs' 
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  pendingApprovalsCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent Monitor', icon: Cpu },
    { id: 'approvals', label: 'Action Approvals', icon: CheckSquare, badge: pendingApprovalsCount },
    { id: 'email-scanner', label: 'Email Ingestion Scanner', icon: Mail },
    { id: 'web-scanner', label: 'Web Content Scanner', icon: Globe },
    { id: 'pdf-scanner', label: 'PDF Document Inspector', icon: FileCode },
    { id: 'logs', label: 'Security Audit Logs', icon: FileText },
    { id: 'settings', label: 'Policy Configurations', icon: Sliders },
  ];

  return (
    <aside 
      style={{
        width: '260px',
        backgroundColor: '#0a0e1a',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div 
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}
        >
          <ShieldAlert size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.8px', color: '#fff' }}>
            SENTINEL <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Zero-Trust Agent Guard
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 12px 10px' }}>
          Navigation
        </div>

        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => onNavigate(item.id as NavPage)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      style={{
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Security Status Box */}
      <div 
        style={{
          padding: '16px',
          margin: '12px',
          background: 'rgba(14, 165, 233, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="status-dot active" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
            Policy Engine Active
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Autonomous action ceiling strictly enforced.
        </div>
      </div>

      {/* Operator Footer */}
      <div 
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px',
            color: 'var(--accent-cyan)'
          }}
        >
          PG
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            Palak Gupta
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Security Analyst
          </div>
        </div>
      </div>
    </aside>
  );
};
