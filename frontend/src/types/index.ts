export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export type ActionStatus = 'ALLOWED' | 'PENDING_APPROVAL' | 'BLOCKED' | 'QUARANTINED';

export type AttackVector = 'EMAIL' | 'WEB' | 'PDF' | 'DIRECT_PROMPT';

export type EventType = 
  | 'PROMPT_INJECTION' 
  | 'EXFILTRATION_ATTEMPT' 
  | 'UNAUTHORIZED_TOOL' 
  | 'ANOMALOUS_PAYLOAD' 
  | 'POLICY_VIOLATION'
  | 'SYSTEM_ALERT';

// Request shape expected by Priyanshu's backend: POST /api/actions/check
export interface BackendActionCheckRequest {
  tool: string;
  params: Record<string, any>;
}

// Response shape from backend POST /api/actions/check
export interface BackendActionCheckResponse {
  authorized?: boolean;
  decision?: string; // e.g. 'ALLOW', 'BLOCK', 'REQUIRE_APPROVAL'
  reason?: string;
  policy?: string;
  risk?: string | number;
  [key: string]: any;
}

export interface BackendHealthResponse {
  status: string;
  timestamp?: string;
  [key: string]: any;
}

export interface ProposedAction {
  id: string;
  timestamp: string;
  toolName: string;
  parameters: Record<string, any>;
  riskLevel: RiskLevel;
  status: ActionStatus;
  targetResource: string;
  reasoning: string;
  policyViolation?: string;
  isSimulatedMock: boolean;
  sourceContext: {
    vector: AttackVector;
    sourceName: string;
    snippet?: string;
  };
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SecurityEventItem {
  id: string;
  timestamp: string;
  type: EventType;
  severity: RiskLevel;
  vector: AttackVector;
  title: string;
  description: string;
  payloadSample: string;
  source: string;
  blocked: boolean;
  mitigation: string;
  isSimulatedMock: boolean;
}

export interface InjectionDetail {
  id: string;
  location: string;
  pattern: string;
  confidence: number;
  rawText: string;
  intent: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  vector: AttackVector;
  sourceTitle: string;
  rawContent: string;
  processingTimeMs: number;
  
  // Real Backend Decision (POST /api/actions/check)
  realBackend: {
    attempted: boolean;
    connected: boolean;
    endpoint: string;
    requestPayload?: BackendActionCheckRequest;
    response?: BackendActionCheckResponse;
    error?: string;
  };

  // Client-Side Simulated Threat Analysis (Demonstration Heuristics)
  simulatedAnalysis: {
    isClean: boolean;
    threatsFound: string[];
    injectionsDetected: InjectionDetail[];
    simulatedRiskScore: number;
    sanitizedContent: string;
    simulatedProposedAction?: ProposedAction;
  };
}

export interface SystemStats {
  totalScanned: number;
  injectionsBlocked: number;
  pendingApprovals: number;
  threatRate: number;
  safeActionsExecuted: number;
  activeAgentSessions: number;
  isSimulatedMock: boolean;
  timeSeriesData: {
    time: string;
    allowed: number;
    blocked: number;
    approvals: number;
  }[];
  vectorBreakdown: {
    name: string;
    count: number;
    blocked: number;
    color: string;
  }[];
}

export interface SecurityPolicyConfig {
  enforceHumanInTheLoop: boolean;
  blockExternalWebhooks: boolean;
  strictEmailExfiltrationCheck: boolean;
  stripHiddenHtmlAndMarkdown: boolean;
  isolatePdfExecutionEnvironment: boolean;
  maxAutonomousRiskScore: number;
  backendBaseUrl: string;
  activeDefenseMode: 'STRICT' | 'BALANCED' | 'PERMISSIVE';
}

export interface AgentSession {
  id: string;
  name: string;
  status: 'IDLE' | 'ANALYZING' | 'WAITING_APPROVAL' | 'HALTED';
  currentTask: string;
  untrustedInputSource: string;
  vector: AttackVector;
  riskScore: number;
  startedAt: string;
  actionsProposedCount: number;
  actionsBlockedCount: number;
  lastHeartbeat: string;
  isSimulatedMock: boolean;
}
