import { useState } from 'react';
import type { FC } from 'react';
import { 
  FileCode, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Check, 
  Flame, 
  Lock, 
  FileText,
  Server
} from 'lucide-react';
import { useSecurityData } from '../hooks/useSecurityData';
import { DEMO_PRESETS } from '../services/mockData';
import type { ScanResult } from '../types';

export const PDFScanner: FC<{ securityData: ReturnType<typeof useSecurityData> }> = ({ securityData }) => {
  const { runScan } = securityData;

  const [documentName, setDocumentName] = useState<string>('Contract_NDA_Vendor_2026.pdf');
  const [content, setContent] = useState<string>(DEMO_PRESETS.pdf[0].content);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'realBackend' | 'injections' | 'layers' | 'raw'>('realBackend');

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await runScan('PDF', content, documentName);
      setScanResult(result);
      setActiveTab('realBackend');
    } finally {
      setIsScanning(false);
    }
  };

  const loadPreset = (index: number) => {
    const preset = DEMO_PRESETS.pdf[index];
    setContent(preset.content);
    if (index === 0) {
      setDocumentName('Contract_NDA_Vendor_2026.pdf');
    } else {
      setDocumentName('Clean_Architecture_Briefing.pdf');
    }
    setScanResult(null);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <FileCode size={22} style={{ color: '#f59e0b' }} />
            PDF Document Steganography & Injection Inspector
          </h2>
          <p className="page-subtitle">
            Evaluate parsed PDF streams against backend <code>POST /api/actions/check</code> with independent low-contrast text layer extraction.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => loadPreset(0)}
          >
            ⚠️ Load Trojan Contract PDF
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => loadPreset(1)}
          >
            ✅ Load Clean Project PDF
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: PDF Stream Sandbox */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <FileText size={16} style={{ color: '#f59e0b' }} />
              PDF Document Stream Sandbox
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low-Level Parser Buffer</span>
          </div>

          <div className="form-group">
            <label className="form-label">Document Filename / Path</label>
            <input 
              type="text" 
              className="form-input" 
              value={documentName} 
              onChange={(e) => setDocumentName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">PDF Stream Data / Extracted Text Blocks</label>
            <textarea 
              className="form-textarea" 
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw PDF object stream or extracted text blocks here..."
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
              <Play size={15} /> {isScanning ? 'Evaluating Against Backend...' : 'Inspect PDF Streams'}
            </button>
          </div>
        </div>

        {/* Right Column: Sentinel Security Analysis */}
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="cyber-card-header">
            <div className="cyber-card-title">
              <ShieldAlert size={16} style={{ color: scanResult?.simulatedAnalysis.isClean ? '#34d399' : '#f87171' }} />
              PDF Contrast & Policy Inspector
            </div>
            {scanResult && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Evaluated in {scanResult.processingTimeMs}ms
              </span>
            )}
          </div>

          {!scanResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <Lock size={44} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Awaiting PDF Input Buffer
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '320px', marginTop: '6px' }}>
                Load the trojan contract preset to witness low-contrast steganography detection alongside backend API calls.
              </p>
            </div>
          ) : (
            <div>
              {/* Distinct Tabs */}
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
                  Simulated Invisible Layers ({scanResult.simulatedAnalysis.injectionsDetected.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('layers')}
                >
                  OCR Contrast Matrix
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
                  onClick={() => setActiveTab('raw')}
                >
                  Raw PDF Stream
                </button>
              </div>

              {/* Tab 1: Real Backend */}
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
                      Target endpoint: <code>{scanResult.realBackend.endpoint}</code>
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
                        {scanResult.realBackend.error || 'Backend not running on port 8000. Real backend decisions will populate here automatically.'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Simulated Invisible Layers */}
              {activeTab === 'injections' && (
                <div>
                  <div 
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      fontSize: '11px',
                      color: '#fbbf24',
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
                          {scanResult.simulatedAnalysis.isClean ? 'SIMULATED VERDICT: COMPLIANT' : 'SIMULATED VERDICT: STEGANOGRAPHIC INJECTION'}
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
                      Clean PDF stream. No concealed text layers located in simulated inspection.
                    </div>
                  ) : (
                    <div>
                      {scanResult.simulatedAnalysis.injectionsDetected.map((inj) => (
                        <div 
                          key={inj.id}
                          style={{
                            background: '#090d16',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            marginBottom: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                              Detection: {inj.pattern}
                            </span>
                            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                              Confidence: {Math.round(inj.confidence * 100)}%
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            {inj.intent}
                          </div>
                          <div className="code-box" style={{ fontSize: '11px', maxHeight: '60px', color: '#fbbf24' }}>
                            {inj.rawText}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: OCR Contrast Matrix */}
              {activeTab === 'layers' && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Optical Contrast & Transparency Matrix (Simulated):
                  </div>
                  <div 
                    style={{
                      padding: '14px',
                      background: '#090d16',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                      lineHeight: 1.6
                    }}
                  >
                    <div>• <strong>Render Layer 0:</strong> Standard Text (Foreground: #000000, Background: #FFFFFF) — Contrast Ratio: 21:1 (Compliant)</div>
                    <div>• <strong>Render Layer 1:</strong> Font 1pt Stream (RGB 1.0, 1.0, 1.0 on #FFFFFF) — Contrast Ratio: 1.00:1 (ANOMALY DETECTED)</div>
                    <div>• <strong>XMP Metadata:</strong> Author and Tool tags inspected. Zero malicious prompt payloads detected in EXIF headers.</div>
                  </div>
                </div>
              )}

              {/* Tab 4: Raw PDF */}
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
