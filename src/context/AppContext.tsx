import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationItem,
  EnvironmentType,
  UserRole,
  SystemStatus,
  TestCase,
  KnowledgeEntity,
  DatabaseTable,
  SqlQueryPattern,
  RequirementItem,
  LearnedPage,
  TestDataProfile,
  TestDataLease,
  SystemDoctorCheck,
  TelemetrySpan,
  AiDecisionLog
} from '../types';
import {
  INITIAL_TEST_CASES,
  INITIAL_ENTITIES,
  INITIAL_DB_TABLES,
  INITIAL_SQL_PATTERNS,
  INITIAL_REQUIREMENTS,
  INITIAL_LEARNED_PAGES,
  INITIAL_TEST_DATA_PROFILES,
  INITIAL_TEST_DATA_LEASES,
  INITIAL_SYSTEM_DOCTOR_CHECKS,
  INITIAL_TELEMETRY_SPANS,
  INITIAL_AI_DECISIONS
} from '../data/mockData';

interface AppContextType {
  activeNav: NavigationItem;
  setActiveNav: (nav: NavigationItem) => void;
  currentEnv: EnvironmentType;
  setCurrentEnv: (env: EnvironmentType) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  systemStatus: SystemStatus;
  
  // Command palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Test cases & execution
  testCases: TestCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  runTestCase: (caseId: string) => void;
  resetTestRun: (caseId: string) => void;
  stepNextAction: (caseId: string) => void;
  
  // Self healing
  aiDecisions: AiDecisionLog[];
  approveSelfHealing: (decisionId: string) => void;
  rejectSelfHealing: (decisionId: string) => void;
  
  // Telemetry & spans
  telemetrySpans: TelemetrySpan[];
  addTelemetrySpan: (span: Omit<TelemetrySpan, 'id' | 'timestamp'>) => void;
  
  // Knowledge & DB
  entities: KnowledgeEntity[];
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;
  databaseTables: DatabaseTable[];
  sqlPatterns: SqlQueryPattern[];
  requirements: RequirementItem[];
  learnedPages: LearnedPage[];
  testDataProfiles: TestDataProfile[];
  testDataLeases: TestDataLease[];
  doctorChecks: SystemDoctorCheck[];
  runSystemDoctorCheck: () => void;
  
  // Leases
  createDataLease: (profileId: string) => void;
  releaseDataLease: (leaseId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavigationItem>('command-center');
  const [currentEnv, setCurrentEnv] = useState<EnvironmentType>('QA');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Senior QA');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('READY');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('tc-019');
  const [aiDecisions, setAiDecisions] = useState<AiDecisionLog[]>(INITIAL_AI_DECISIONS);
  const [telemetrySpans, setTelemetrySpans] = useState<TelemetrySpan[]>(INITIAL_TELEMETRY_SPANS);
  const [entities] = useState<KnowledgeEntity[]>(INITIAL_ENTITIES);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('e-1');
  const [databaseTables] = useState<DatabaseTable[]>(INITIAL_DB_TABLES);
  const [sqlPatterns] = useState<SqlQueryPattern[]>(INITIAL_SQL_PATTERNS);
  const [requirements] = useState<RequirementItem[]>(INITIAL_REQUIREMENTS);
  const [learnedPages] = useState<LearnedPage[]>(INITIAL_LEARNED_PAGES);
  const [testDataProfiles, setTestDataProfiles] = useState<TestDataProfile[]>(INITIAL_TEST_DATA_PROFILES);
  const [testDataLeases, setTestDataLeases] = useState<TestDataLease[]>(INITIAL_TEST_DATA_LEASES);
  const [doctorChecks, setDoctorChecks] = useState<SystemDoctorCheck[]>(INITIAL_SYSTEM_DOCTOR_CHECKS);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTelemetrySpan = (span: Omit<TelemetrySpan, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newSpan: TelemetrySpan = {
      ...span,
      id: 'sp-' + Date.now(),
      timestamp: timeStr
    };
    setTelemetrySpans(prev => [newSpan, ...prev]);
  };

  const approveSelfHealing = (decisionId: string) => {
    setAiDecisions(prev =>
      prev.map(item => {
        if (item.id === decisionId && item.healingDetails) {
          return {
            ...item,
            healingDetails: {
              ...item.healingDetails,
              approved: true
            }
          };
        }
        return item;
      })
    );
    addTelemetrySpan({
      traceId: 'tr-' + Math.floor(Math.random() * 9000 + 1000),
      runId: 'RUN-1882',
      caseId: 'CU-019',
      stepId: 's-4',
      environment: currentEnv,
      component: 'system',
      action: 'HEALING_APPROVED: [data-testid="consent-accept"] registrado como selector canónico',
      durationMs: 14,
      status: 'OK'
    });
  };

  const rejectSelfHealing = (decisionId: string) => {
    setAiDecisions(prev =>
      prev.map(item => {
        if (item.id === decisionId && item.healingDetails) {
          return {
            ...item,
            healingDetails: {
              ...item.healingDetails,
              approved: false
            }
          };
        }
        return item;
      })
    );
    addTelemetrySpan({
      traceId: 'tr-' + Math.floor(Math.random() * 9000 + 1000),
      runId: 'RUN-1882',
      caseId: 'CU-019',
      stepId: 's-4',
      environment: currentEnv,
      component: 'system',
      action: 'HEALING_REJECTED: Selector fallback revertido a inspección manual',
      durationMs: 10,
      status: 'ERROR'
    });
  };

  const runTestCase = (caseId: string) => {
    setTestCases(prev =>
      prev.map(tc => {
        if (tc.id === caseId) {
          return {
            ...tc,
            status: 'RUNNING',
            steps: tc.steps.map((s, idx) => ({
              ...s,
              status: idx === 0 ? 'COMPLETED' : idx === 1 ? 'RUNNING' : 'PENDING'
            }))
          };
        }
        return tc;
      })
    );
    addTelemetrySpan({
      traceId: 'tr-dispatch-' + Date.now().toString().slice(-4),
      runId: 'RUN-1890',
      caseId: testCases.find(t => t.id === caseId)?.code || caseId,
      stepId: 'start',
      environment: currentEnv,
      component: 'system',
      action: `DISPATCH_JOB: Iniciando ejecución en worker web-01`,
      durationMs: 25,
      status: 'OK'
    });
  };

  const stepNextAction = (caseId: string) => {
    setTestCases(prev =>
      prev.map(tc => {
        if (tc.id === caseId) {
          const runningIndex = tc.steps.findIndex(s => s.status === 'RUNNING');
          if (runningIndex !== -1) {
            const nextSteps = [...tc.steps];
            nextSteps[runningIndex] = { ...nextSteps[runningIndex], status: 'COMPLETED' };
            if (runningIndex + 1 < nextSteps.length) {
              nextSteps[runningIndex + 1] = { ...nextSteps[runningIndex + 1], status: 'RUNNING' };
            } else {
              return { ...tc, status: 'PASS', steps: nextSteps };
            }
            return { ...tc, steps: nextSteps };
          }
        }
        return tc;
      })
    );
  };

  const resetTestRun = (caseId: string) => {
    setTestCases(prev =>
      prev.map(tc => {
        if (tc.id === caseId) {
          return {
            ...tc,
            status: 'READY',
            steps: tc.steps.map(s => ({ ...s, status: 'PENDING' }))
          };
        }
        return tc;
      })
    );
  };

  const runSystemDoctorCheck = () => {
    setSystemStatus('READY');
    setDoctorChecks(prev =>
      prev.map(c => ({
        ...c,
        status: 'OK',
        latencyMs: Math.floor(Math.random() * 8 + 1)
      }))
    );
  };

  const createDataLease = (profileId: string) => {
    const profile = testDataProfiles.find(p => p.id === profileId);
    if (!profile) return;
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    const newLease: TestDataLease = {
      id: `lease-${Date.now().toString().slice(-4)}`,
      entityKey: `${profile.entityName.toLowerCase()}:${randomSuffix}`,
      maskedValue: `QA-${profile.entityName.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 9000 + 1000)} (•••${randomSuffix})`,
      runId: `RUN-${Math.floor(Math.random() * 900 + 1800)}`,
      caseId: 'CU-019',
      acquiredAt: new Date().toLocaleTimeString(),
      expiresAt: 'TTL 15 min',
      status: 'ACTIVE'
    };
    setTestDataLeases(prev => [newLease, ...prev]);
    setTestDataProfiles(prev =>
      prev.map(p => (p.id === profileId ? { ...p, inUseCount: p.inUseCount + 1 } : p))
    );
  };

  const releaseDataLease = (leaseId: string) => {
    setTestDataLeases(prev =>
      prev.map(l => (l.id === leaseId ? { ...l, status: 'RELEASED' } : l))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        currentEnv,
        setCurrentEnv,
        currentUserRole,
        setCurrentUserRole,
        systemStatus,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        testCases,
        selectedCaseId,
        setSelectedCaseId,
        runTestCase,
        resetTestRun,
        stepNextAction,
        aiDecisions,
        approveSelfHealing,
        rejectSelfHealing,
        telemetrySpans,
        addTelemetrySpan,
        entities,
        selectedEntityId,
        setSelectedEntityId,
        databaseTables,
        sqlPatterns,
        requirements,
        learnedPages,
        testDataProfiles,
        testDataLeases,
        doctorChecks,
        runSystemDoctorCheck,
        createDataLease,
        releaseDataLease
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
