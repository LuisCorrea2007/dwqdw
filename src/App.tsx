import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPaletteModal } from './components/CommandPaletteModal';

// Views
import { CommandCenterView } from './views/CommandCenterView';
import { QaWorkspaceView } from './views/QaWorkspaceView';
import { RequirementsIntelligenceView } from './views/RequirementsIntelligenceView';
import { TestCaseCatalogView } from './views/TestCaseCatalogView';
import { SuitesView } from './views/SuitesView';
import { ExecutionsHistoryView } from './views/ExecutionsHistoryView';
import { TestDataManagerView } from './views/TestDataManagerView';
import { KnowledgeGraphView } from './views/KnowledgeGraphView';
import { DatabaseIntelligenceView } from './views/DatabaseIntelligenceView';
import { LearnedPagesView } from './views/LearnedPagesView';
import { SqlPatternsView } from './views/SqlPatternsView';
import { PlaybooksView } from './views/PlaybooksView';
import { SqlStudioView } from './views/SqlStudioView';
import { ApiStudioView } from './views/ApiStudioView';
import { BrowserStudioView } from './views/BrowserStudioView';
import { EnvironmentsView } from './views/EnvironmentsView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminAuditView } from './views/AdminAuditView';
import { AdminPrivacyView } from './views/AdminPrivacyView';
import { SystemDoctorView } from './views/SystemDoctorView';

const MainContent: React.FC = () => {
  const { activeNav } = useApp();

  const renderCurrentView = () => {
    switch (activeNav) {
      case 'command-center':
        return <CommandCenterView />;
      case 'qa-workspace':
        return <QaWorkspaceView />;
      case 'qa-requirements':
        return <RequirementsIntelligenceView />;
      case 'qa-test-cases':
        return <TestCaseCatalogView />;
      case 'qa-suites':
        return <SuitesView />;
      case 'qa-executions':
        return <ExecutionsHistoryView />;
      case 'qa-test-data':
        return <TestDataManagerView />;
      case 'intel-knowledge-graph':
        return <KnowledgeGraphView />;
      case 'intel-db-intelligence':
        return <DatabaseIntelligenceView />;
      case 'intel-learned-pages':
      case 'env-pages':
        return <LearnedPagesView />;
      case 'intel-sql-patterns':
        return <SqlPatternsView />;
      case 'intel-playbooks':
        return <PlaybooksView />;
      case 'studio-sql':
        return <SqlStudioView />;
      case 'studio-api':
        return <ApiStudioView />;
      case 'studio-browser':
        return <BrowserStudioView />;
      case 'env-connections':
      case 'env-policies':
        return <EnvironmentsView />;
      case 'env-health':
      case 'admin-doctor':
        return <SystemDoctorView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-audit':
        return <AdminAuditView />;
      case 'admin-privacy':
        return <AdminPrivacyView />;
      default:
        return <CommandCenterView />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100">
      {renderCurrentView()}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <CommandPaletteModal />
      </div>
    </AppProvider>
  );
}
