import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { NavPage } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { AgentMonitor } from './pages/AgentMonitor';
import { EmailScanner } from './pages/EmailScanner';
import { WebScanner } from './pages/WebScanner';
import { PDFScanner } from './pages/PDFScanner';
import { Approvals } from './pages/Approvals';
import { SecurityLogs } from './pages/SecurityLogs';
import { Settings } from './pages/Settings';
import { useSecurityData } from './hooks/useSecurityData';

export function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const securityData = useSecurityData();

  const getPageTitle = (page: NavPage): string => {
    switch (page) {
      case 'dashboard':
        return 'Executive Security Dashboard';
      case 'agents':
        return 'Agent Supervisor Telemetry';
      case 'approvals':
        return 'Human-in-the-Loop Action Authorization';
      case 'email-scanner':
        return 'Email Ingestion Security Scanner';
      case 'web-scanner':
        return 'Web Scraping & DOM Inspector';
      case 'pdf-scanner':
        return 'PDF Document Steganography Inspector';
      case 'logs':
        return 'Security Audit Trail & Incident Logs';
      case 'settings':
        return 'Deterministic Policy Engine Configurations';
      default:
        return 'Sentinel AI';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} securityData={securityData} />;
      case 'agents':
        return <AgentMonitor onNavigate={setCurrentPage} securityData={securityData} />;
      case 'approvals':
        return <Approvals securityData={securityData} />;
      case 'email-scanner':
        return <EmailScanner securityData={securityData} />;
      case 'web-scanner':
        return <WebScanner securityData={securityData} />;
      case 'pdf-scanner':
        return <PDFScanner securityData={securityData} />;
      case 'logs':
        return <SecurityLogs securityData={securityData} />;
      case 'settings':
        return <Settings securityData={securityData} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} securityData={securityData} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        pendingApprovalsCount={securityData.approvals.length}
      />

      <div className="main-content">
        <Header 
          title={getPageTitle(currentPage)}
          onRefresh={securityData.refreshData}
          isLoading={securityData.isLoading}
          pendingCount={securityData.approvals.length}
          backendConnected={securityData.backendHealth.connected}
        />

        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
