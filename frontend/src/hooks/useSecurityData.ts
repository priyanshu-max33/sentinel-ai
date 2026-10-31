import { useState, useEffect, useCallback } from 'react';
import type { 
  SystemStats, 
  ProposedAction, 
  SecurityEventItem, 
  AgentSession, 
  SecurityPolicyConfig, 
  ScanResult, 
  AttackVector 
} from '../types';
import { SentinelApi } from '../services/api';

export function useSecurityData() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [approvals, setApprovals] = useState<ProposedAction[]>([]);
  const [events, setEvents] = useState<SecurityEventItem[]>([]);
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicyConfig | null>(null);
  const [backendHealth, setBackendHealth] = useState<{ connected: boolean; url: string; data?: any }>({
    connected: false,
    url: 'http://localhost:8000'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsData, approvalsData, eventsData, sessionsData, policiesData, healthData] = await Promise.all([
        SentinelApi.getSystemStats(),
        SentinelApi.getPendingApprovals(),
        SentinelApi.getSecurityEvents(),
        SentinelApi.getAgentSessions(),
        SentinelApi.getPolicies(),
        SentinelApi.checkBackendHealth()
      ]);

      setStats(statsData);
      setApprovals(approvalsData);
      setEvents(eventsData);
      setSessions(sessionsData);
      setPolicies(policiesData);
      setBackendHealth(healthData);
    } catch (err: any) {
      console.error('Error refreshing security telemetry:', err);
      setError(err?.message || 'Failed to load telemetry data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [statsData, approvalsData, eventsData, sessionsData, policiesData, healthData] = await Promise.all([
          SentinelApi.getSystemStats(),
          SentinelApi.getPendingApprovals(),
          SentinelApi.getSecurityEvents(),
          SentinelApi.getAgentSessions(),
          SentinelApi.getPolicies(),
          SentinelApi.checkBackendHealth()
        ]);

        if (isMounted) {
          setStats(statsData);
          setApprovals(approvalsData);
          setEvents(eventsData);
          setSessions(sessionsData);
          setPolicies(policiesData);
          setBackendHealth(healthData);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load telemetry data');
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApproval = async (actionId: string, decision: 'APPROVE' | 'REJECT', notes?: string) => {
    try {
      await SentinelApi.respondToApproval(actionId, decision, notes);
      setApprovals(prev => prev.filter(a => a.id !== actionId));
      if (stats) {
        setStats({
          ...stats,
          pendingApprovals: Math.max(0, stats.pendingApprovals - 1),
          injectionsBlocked: decision === 'REJECT' ? stats.injectionsBlocked + 1 : stats.injectionsBlocked,
          safeActionsExecuted: decision === 'APPROVE' ? stats.safeActionsExecuted + 1 : stats.safeActionsExecuted
        });
      }
      const updatedEvents = await SentinelApi.getSecurityEvents();
      setEvents(updatedEvents);
    } catch (err: any) {
      console.error('Approval operation failed:', err);
      throw err;
    }
  };

  const updatePolicies = async (updates: Partial<SecurityPolicyConfig>) => {
    try {
      const updated = await SentinelApi.updatePolicies(updates);
      setPolicies(updated);
    } catch (err: any) {
      console.error('Policy update failed:', err);
      throw err;
    }
  };

  const runScan = async (vector: AttackVector, content: string, title: string): Promise<ScanResult> => {
    const result = await SentinelApi.scanInput(vector, content, title);
    refreshData();
    return result;
  };

  return {
    stats,
    approvals,
    events,
    sessions,
    policies,
    backendHealth,
    isLoading,
    error,
    refreshData,
    handleApproval,
    updatePolicies,
    runScan
  };
}
