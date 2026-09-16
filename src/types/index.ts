export type EnvironmentType = 'DEV' | 'QA' | 'UAT' | 'PREPROD' | 'PROD';

export type UserRole = 
  | 'Viewer'
  | 'QA Engineer'
  | 'Senior QA'
  | 'Data Steward'
  | 'Environment Admin'
  | 'Security Admin'
  | 'Platform Admin';

export type SystemStatus = 'READY' | 'DEGRADED' | 'BLOCKED';

export type NavigationItem =
  | 'command-center'
  | 'qa-workspace'
  | 'qa-requirements'
  | 'qa-test-cases'
  | 'qa-suites'
  | 'qa-executions'
  | 'qa-test-data'
  | 'intel-knowledge-graph'
  | 'intel-db-intelligence'
  | 'intel-learned-pages'
  | 'intel-sql-patterns'
  | 'intel-playbooks'
  | 'studio-sql'
  | 'studio-api'
  | 'studio-browser'
  | 'env-connections'
  | 'env-pages'
  | 'env-health'
  | 'env-policies'
  | 'admin-users'
  | 'admin-audit'
  | 'admin-privacy'
  | 'admin-doctor';

export type SensitivityClass =
  | 'PUBLIC_METADATA'
  | 'INTERNAL_METADATA'
  | 'BUSINESS_IDENTIFIER'
  | 'PII'
  | 'HEALTH_SENSITIVE'
  | 'AUTH_SECRET'
  | 'FREE_TEXT_UNKNOWN';

export type ActionRisk = 'non_destructive' | 'state_change' | 'destructive_requires_approval';

export type PlaybookState = 
  | 'DISCOVERED'
  | 'GENERATED'
  | 'PREFLIGHTED'
  | 'REPLAYED'
  | 'VERIFIED'
  | 'TRUSTED'
  | 'BLOCKED';

export interface StepDefinition {
  id: string;
  name: string;
  action: string;
  target?: {
    role?: string;
    name?: string;
    selector?: string;
    concept?: string;
  };
  expected?: string;
  risk: ActionRisk;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';
  durationMs?: number;
  evidence?: {
    screenshotUrl?: string;
    httpRequest?: {
      method: string;
      url: string;
      status: number;
      durationMs: number;
    };
    dbQuery?: {
      sql: string;
      before: string;
      after: string;
      verified: boolean;
    };
  };
}

export interface TestCase {
  id: string;
  code: string; // e.g. "CU-019"
  name: string;
  description: string;
  environment: EnvironmentType;
  preconditions: string[];
  steps: StepDefinition[];
  status: 'READY' | 'RUNNING' | 'PASS' | 'FAIL' | 'BLOCKED' | 'FLAKY';
  lastRun?: string;
  coverageRequirements: string[];
  channels: ('Web' | 'Mobile' | 'API' | 'DB')[];
}

export interface TestDataProfile {
  id: string;
  name: string;
  description: string;
  candidateCount: number;
  inUseCount: number;
  status: 'READY' | 'EMPTY' | 'BLOCKED';
  sampleMaskedKey: string;
  identifierColumn: string;
  entityName: string;
}

export interface TestDataLease {
  id: string;
  entityKey: string;
  maskedValue: string;
  runId: string;
  caseId: string;
  expiresAt: string;
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  acquiredAt: string;
}

export interface KnowledgeEntity {
  id: string;
  name: string;
  aliases: string[];
  identifiers: {
    relation: string;
    column: string;
    confidence: number;
    provenance: string[];
  }[];
  relationships: {
    to: string;
    via: string[];
    kind: 'foreign_key' | 'inferred';
    confidence: number;
    auditDetails: {
      namesCompatible: boolean;
      dataTypesMatch: string;
      indexedOnBoth: boolean;
      sampledRows: number;
      matchingCount: number;
      fkDeclared: boolean;
    };
  }[];
  verifiedPatternsCount: number;
}

export interface DatabaseColumn {
  name: string;
  dataType: string;
  isPk: boolean;
  isFk: boolean;
  isNullable: boolean;
  hasIndex: boolean;
  sensitivityClass: SensitivityClass;
  samplingAllowed: boolean;
  externalLlmAllowed: boolean;
  comments?: string;
  distinctValuesEstimate?: number;
}

export interface DatabaseTable {
  schema: string;
  name: string;
  rowCountEstimate: number;
  columns: DatabaseColumn[];
}

export interface SqlQueryPattern {
  id: string;
  intentKey: string;
  description: string;
  entitiesRequired: string[];
  normalizedAst: string;
  sampleSql: string;
  confidence: number;
  successCount: number;
  failureCount: number;
  lastVerifiedAt: string;
  confidenceBreakdown: {
    intentSimilarity: number;
    schemaCompatibility: number;
    historicalSuccess: number;
    recency: number;
  };
}

export interface RequirementItem {
  id: string;
  code: string; // e.g. "REQ-017"
  title: string;
  text: string;
  sourceDoc: string;
  sourceSection: string;
  sourcePage: number;
  status: 'COVERED' | 'PARTIAL' | 'UNCOVERED' | 'AMBIGUOUS';
  coverageCases: {
    caseCode: string;
    outcome: 'PASS' | 'FAIL' | 'PENDING';
  }[];
  channels: ('Web' | 'Mobile' | 'API' | 'DB')[];
  needsClarification: boolean;
  clarificationNotes?: string;
  gapAnalysis?: string;
}

export interface LearnedPage {
  id: string;
  name: string;
  url: string;
  route: string;
  environment: EnvironmentType;
  allowedOrigin: string;
  lastLearned: string;
  version: string;
  discoveredRoutesCount: number;
  apiEndpointsCount: number;
  crawlingPolicy: {
    maxDepth: number;
    maxPages: number;
    maxDurationMin: number;
    allowedMethods: string[];
    ssrfSafe: boolean;
  };
  semanticControls: {
    id: string;
    concept: string;
    role: string;
    accessibleName: string;
    testid?: string;
    text: string;
    risk: ActionRisk;
  }[];
}

export interface SystemDoctorCheck {
  id: string;
  category: 'Core' | 'Control Plane' | 'Browser' | 'PostgreSQL' | 'Knowledge' | 'Security' | 'Observability';
  name: string;
  description: string;
  status: 'OK' | 'WARNING' | 'FAILED';
  latencyMs?: number;
  details: string;
  remediation?: string;
}

export interface TelemetrySpan {
  id: string;
  timestamp: string;
  traceId: string;
  runId: string;
  caseId: string;
  stepId: string;
  environment: EnvironmentType;
  component: 'web' | 'api' | 'db' | 'knowledge' | 'system';
  action: string;
  durationMs: number;
  status: 'OK' | 'ERROR' | 'PENDING';
  details?: string;
}

export interface AiDecisionLog {
  id: string;
  timestamp: string;
  stepName: string;
  decision: string;
  evidence: Record<string, string>;
  confidence: number;
  isSelfHealing?: boolean;
  healingDetails?: {
    oldSelector: string;
    newSelector: string;
    reason: string;
    approved?: boolean;
  };
}
