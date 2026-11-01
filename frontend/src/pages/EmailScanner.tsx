import { useState } from 'react';
import type { FC } from 'react';
import { 
  Mail, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Check, 
  Flame, 
  Lock, 
  Server
} from 'lucide-react';
import { useSecurityData } from '../hooks/useSecurityData';
import { DEMO_PRESETS } from '../services/mockData';
import type { ScanResult } from '../types';

export const EmailScanner: FC<{ securityData: ReturnType<typeof useSecurityData> }> = ({ securityData }) => {
  const { runScan } = securityData;

  const [sender, setSender] = useState<string>('accounting@trusted-vendor-portal.biz');
  const [subject, setSubject] = useState<string>('URGENT: Outstanding Payment Due (Invoice #99481)');
  const [content, setContent] = useState<string>(DEMO_PRESETS.email[0].content);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'realBackend' | 'injections' | 'sanitized' | 'raw'>('realBackend');

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await runScan('EMAIL', content, `${sender} - ${subject}`);
      setScanResult(result);
      setActiveTab('realBackend');
    } finally {
      setIsScanning(false);
    }
  };

  const loadPreset = (index: number) => {
    const preset = DEMO_PRESETS.email[index];
    setContent(preset.content);
    if (index === 0) {
      setSender('accounting@trusted-vendor-portal.biz');
      setSubject('URGENT: Outstanding Payment Due (Invoice #99481)');
    } else {
      setSender('sarah.miller@cloudprovider.com');
      setSubject('Scheduled Maintenance Window: Nov 5th');
    }
    setScanResult(null);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Mail size={22} style={{ color: 'var(--accent-cyan)' }} />
            Email Ingestion Security Scanner
          </h2>
          <p className="page-subtitle">
            Evaluate inbound emails through Priyanshu's backend <code>POST /api/actions/check</code> with independent demonstration heuristics.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => loadPreset(0)}
          >
            ⚠️ Load Trojan Invoice
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => loadPreset(1)}
          >
            ✅ Load Clean Email
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Email Input Sandbox */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <Mail size={16} style={{ color: 'var(--accent-cyan)' }} />
              Inbound Email Stream Sandbox
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Untrusted Ingestion Vector</span>
          </div>

          <div className="form-group">
            <label className="form-label">Sender Address (RFC 5322 From:)</label>
            <input 
              type="text" 
              className="form-input" 
              value={sender} 
              onChange={(e) => setSender(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject Line</label>
            <input 
              type="text" 
              className="form-input" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Raw Inbound Email Message Body</label>
            <textarea 
              className="form-textarea" 
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw email message or HTML body here..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setContent('');
                setScanResult(null);
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>

            <button 
              className="btn btn-primary"
              onClick={handleScan}
              disabled={isScanning || !content.trim()}
            >
              <Play size={15} /> {isScanning ? 'Evaluating Against Backend...' : 'Inspect Email Ingestion'}
            </button>
          </div>
        </div>

        {/* Right Column: Sentinel Security Analysis */}
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <ShieldAlert size={16} style={{ color: scanResult?.simulatedAnalysis.isClean ? '#34d399' : '#f87171' }} />
              Dual-Plane Evaluation Telemetry
            </div>
            {scanResult && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Processed in {scanResult.processingTimeMs}ms
              </span>
            )}
          </div>

          {!scanResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <Lock size={44} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Awaiting Untrusted Ingestion Stream
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '320px', marginTop: '6px' }}>
                Click "Inspect Email Ingestion" or select a preset to evaluate against Priyanshu's backend API and simulated heuristics.
              </p>
            </div>
          ) : (
            <div>
              {/* Distinct Tabs for Real Backend vs Simulated Heuristics */}
              <div className="tabs-nav">
                <button 
                  className={`tab-btn ${activeTab === 'realBackend' ? 'active' : ''}`}
                  onClick={() => setActiveTab('realBackend')}
                >
                  <Server size={14} /> Real Backend Decision
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'injections' ? 'active' : ''}`}
                  onClick={() => setActiveTab('injections')}
                >
                  Simulated Threat Heuristics ({scanResult.simulatedAnalysis.injectionsDetected.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'sanitized' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sanitized')}
                >
                  Sanitized Stream
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
                  onClick={() => setActiveTab('raw')}
                >
                  Raw Input
                </button>
              </div>

              {/* Tab 1: Real Backend Decision */}
              {activeTab === 'realBackend' && (
                <div>
                  <div 
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-sm)',
                      background: scanResult.realBackend.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      border: `1px solid ${scanResult.realBackend.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: scanResult.realBackend.connected ? '#34d399' : '#fbbf24' }}>
                      <Server size={16} />
                      {scanResult.realBackend.connected 
                        ? 'CONNECTED TO REAL BACKEND (POST /api/actions/check)' 
                        : 'BACKEND OFFLINE / UNREACHABLE'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Endpoint target: <code>{scanResult.realBackend.endpoint}</code>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Exact JSON Request Dispatched:
                    </div>
                    <div className="code-box" style={{ maxHeight: '110px' }}>
                      {JSON.stringify(scanResult.realBackend.requestPayload, null, 2)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Actual Backend Response:
                    </div>
                    {scanResult.realBackend.connected && scanResult.realBackend.response ? (
                      <div className="code-box" style={{ maxHeight: '140px', color: '#34d399' }}>
                        {JSON.stringify(scanResult.realBackend.response, null, 2)}
                      </div>
                    ) : (
                      <div 
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#090d16',
                          border: '1px solid var(--border-color)',
                          fontSize: '12px',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {scanResult.realBackend.error || 'Backend not currently running on http://localhost:8000. When Priyanshu launches uvicorn, real policy decisions will populate here automatically.'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Simulated Threat Analysis */}
              {activeTab === 'injections' && (
                <div>
                  <div 
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      fontSize: '11px',
                      color: '#fca5a5',
                      marginBottom: '12px'
                    }}
                  >
                    <strong>Notice:</strong> The following heuristic detections are simulated for demonstration purposes. They are evaluated independently from the backend API.
                  </div>

                  <div 
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: scanResult.simulatedAnalysis.isClean ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${scanResult.simulatedAnalysis.isClean ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      marginBottom: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {scanResult.simulatedAnalysis.isClean ? <ShieldCheck size={18} style={{ color: '#34d399' }} /> : <Flame size={18} style={{ color: '#ef4444' }} />}
                        <span style={{ fontSize: '13px', fontWeight: 700, color: scanResult.simulatedAnalysis.isClean ? '#34d399' : '#f87171' }}>
                          {scanResult.simulatedAnalysis.isClean ? 'SIMULATED VERDICT: SAFE' : 'SIMULATED VERDICT: INJECTION PATTERNS FOUND'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: scanResult.simulatedAnalysis.isClean ? '#34d399' : '#ef4444' }}>
                      {scanResult.simulatedAnalysis.simulatedRiskScore}/100
                    </div>
                  </div>

                  {scanResult.simulatedAnalysis.injectionsDetected.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#34d399', fontSize: '13px' }}>
                      <Check size={24} style={{ margin: '0 auto 6px' }} />
                      No adversarial prompt signatures detected in simulated scan.
                    </div>
                  ) : (
                    <div>
                      {scanResult.simulatedAnalysis.injectionsDetected.map((inj) => (
                        <div 
                          key={inj.id}
                          style={{
                            background: '#090d16',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            marginBottom: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>
                              Pattern: {inj.pattern}
                            </span>
                            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                              Confidence: {Math.round(inj.confidence * 100)}%
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            {inj.intent}
                          </div>
                          <div className="code-box" style={{ fontSize: '11px', maxHeight: '60px', color: '#fca5a5' }}>
                            {inj.rawText}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Sanitized Stream */}
              {activeTab === 'sanitized' && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Normalized token stream stripped of hidden zero-width and CSS tags:
                  </div>
                  <div className="code-box" style={{ maxHeight: '280px', color: '#38bdf8' }}>
                    {scanResult.simulatedAnalysis.sanitizedContent}
                  </div>
                </div>
              )}

              {/* Tab 4: Raw Input */}
              {activeTab === 'raw' && (
                <div className="code-box" style={{ maxHeight: '300px' }}>
                  {scanResult.rawContent}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
