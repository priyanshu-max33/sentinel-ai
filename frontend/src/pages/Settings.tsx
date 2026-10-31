import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  Sliders, 
  Save, 
  Lock, 
  Server, 
  Check
} from 'lucide-react';
import { useSecurityData } from '../hooks/useSecurityData';
import type { SecurityPolicyConfig } from '../types';

export const Settings: FC<{ securityData: ReturnType<typeof useSecurityData> }> = ({ securityData }) => {
  const { policies, updatePolicies } = securityData;

  const [form, setForm] = useState<SecurityPolicyConfig>(policies || {
    enforceHumanInTheLoop: true,
    blockExternalWebhooks: true,
    strictEmailExfiltrationCheck: true,
    stripHiddenHtmlAndMarkdown: true,
    isolatePdfExecutionEnvironment: true,
    maxAutonomousRiskScore: 25,
    backendBaseUrl: 'http://localhost:8000',
    activeDefenseMode: 'STRICT'
  });

  const [saved, setSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePolicies(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Sliders size={22} style={{ color: 'var(--accent-cyan)' }} />
            Deterministic Policy Engine Settings
          </h2>
          <p className="page-subtitle">
            Configure hard isolation rules, autonomous risk thresholds, and backend API integration endpoints.
          </p>
        </div>

        {saved && (
          <div 
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={14} /> Security Policies Applied Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid-2">
        {/* Left Card: Core Security Gates */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Lock size={16} style={{ color: 'var(--accent-cyan)' }} />
              Autonomous Action Trust Gates
            </div>
          </div>

          {/* Defense Mode Selector */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Active Defense Strictness Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
              {(['STRICT', 'BALANCED', 'PERMISSIVE'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setForm({ ...form, activeDefenseMode: mode })}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: form.activeDefenseMode === mode 
                      ? '1px solid var(--accent-cyan)' 
                      : '1px solid var(--border-color)',
                    background: form.activeDefenseMode === mode 
                      ? 'rgba(56, 189, 248, 0.15)' 
                      : '#080c16',
                    color: form.activeDefenseMode === mode ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              {form.activeDefenseMode === 'STRICT' && '🔒 All tools with external side effects require analyst authorization.'}
              {form.activeDefenseMode === 'BALANCED' && '⚖️ Read-only actions permitted; high-privilege commands gated.'}
              {form.activeDefenseMode === 'PERMISSIVE' && '⚠️ Auditing only. Tools executed autonomously (Test mode only).'}
            </div>
          </div>

          {/* Autonomous Risk Score Ceiling */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Autonomous Action Risk Ceiling (0 - 100)</label>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {form.maxAutonomousRiskScore}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={form.maxAutonomousRiskScore}
              onChange={(e) => setForm({ ...form, maxAutonomousRiskScore: Number(e.target.value) })}
              style={{ width: '100%', marginTop: '8px', accentColor: 'var(--accent-cyan)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Actions with risk score above {form.maxAutonomousRiskScore} are flagged for Human-in-the-Loop review.
            </div>
          </div>

          {/* Policy Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={form.enforceHumanInTheLoop}
                onChange={(e) => setForm({ ...form, enforceHumanInTheLoop: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Enforce Human-in-the-Loop for Privileged Actions
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Halts dangerous tools for analyst verification.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={form.blockExternalWebhooks}
                onChange={(e) => setForm({ ...form, blockExternalWebhooks: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Block External Webhook & SSRF Egress
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Denies outbound connections to non-whitelisted IP addresses and DNS domains.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Right Card: Vector Sanitizers & Integration */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Server size={16} style={{ color: 'var(--accent-cyan)' }} />
              Ingestion Sanitizers & Backend Connectivity
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={form.strictEmailExfiltrationCheck}
                onChange={(e) => setForm({ ...form, strictEmailExfiltrationCheck: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Strict Email Recipient Allowlist
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Prevents agents from auto-dispatching messages to external unrecognized domains.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={form.stripHiddenHtmlAndMarkdown}
                onChange={(e) => setForm({ ...form, stripHiddenHtmlAndMarkdown: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Strip Hidden CSS & Zero-Font Steganography
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Removes elements with `display:none`, `font-size:0`, or Unicode zero-width sequences.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={form.isolatePdfExecutionEnvironment}
                onChange={(e) => setForm({ ...form, isolatePdfExecutionEnvironment: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Isolate PDF Rendering Buffer
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Discards low-contrast white-on-white text layers before LLM tokenization.
                </div>
              </div>
            </label>
          </div>

          {/* Backend API Endpoint */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Priyanshu's Backend Base URL</label>
            <input 
              type="text" 
              className="form-input" 
              value={form.backendBaseUrl}
              onChange={(e) => setForm({ ...form, backendBaseUrl: e.target.value })}
              placeholder="http://localhost:8000"
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Targeting: <code>GET {form.backendBaseUrl}/health</code> and <code>POST {form.backendBaseUrl}/api/actions/check</code>.
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSaving}
            >
              <Save size={14} /> {isSaving ? 'Updating...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
