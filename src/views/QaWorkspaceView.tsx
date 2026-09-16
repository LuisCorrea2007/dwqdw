import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Layers,
  Terminal,
  Activity,
  Maximize2,
  Camera,
  Search,
  Check,
  X,
  FileCode,
  ExternalLink,
  Lock
} from 'lucide-react';

type DrawerTab = 'timeline' | 'network' | 'api' | 'database' | 'console' | 'evidence' | 'ai-decisions';

export const QaWorkspaceView: React.FC = () => {
  const {
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
    currentEnv
  } = useApp();

  const [activeTab, setActiveTab] = useState<DrawerTab>('timeline');
  const [showDomDiff, setShowDomDiff] = useState(false);
  const [consentAcceptedLocally, setConsentAcceptedLocally] = useState(false);

  const activeCase = testCases.find(tc => tc.id === selectedCaseId) || testCases[0];

  const handleStep = () => {
    stepNextAction(activeCase.id);
    if (activeCase.steps.find(s => s.id === 's-4')?.status === 'RUNNING') {
      setConsentAcceptedLocally(true);
    }
  };

  const handleReset = () => {
    resetTestRun(activeCase.id);
    setConsentAcceptedLocally(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] select-none bg-slate-950 overflow-hidden">
      {/* Workspace Header Bar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/70 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              {activeCase.code}
            </span>
            <span className="text-sm font-semibold text-white">{activeCase.name}</span>
          </div>

          <span className="text-slate-600">·</span>

          <div className="flex items-center space-x-1.5 font-mono text-xs">
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              activeCase.status === 'RUNNING'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 animate-pulse'
                : activeCase.status === 'PASS'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {activeCase.status}
            </span>
            <span className="text-slate-400">· {currentEnv} · RUN-1882</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => runTestCase(activeCase.id)}
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
            title="Ejecutar caso completo"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Ejecutar</span>
          </button>
          <button
            onClick={handleStep}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
            title="Avanzar un paso (Step deterministic)"
          >
            <SkipForward className="w-3 h-3" />
            <span>Paso Siguiente</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded text-xs font-mono transition-colors"
            title="Reiniciar ejecución"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Execution Split: Live Browser (Left) + Playbook (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-b border-slate-800">
        {/* Left: Live Browser Screencast & CDP Session (7 cols) */}
        <div className="lg:col-span-7 border-r border-slate-800 bg-slate-950 flex flex-col overflow-hidden">
          {/* Browser Address Bar */}
          <div className="h-9 border-b border-slate-800 bg-slate-900/60 px-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2 truncate">
              <div className="flex space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 flex items-center text-[11px] truncate">
                <Lock className="w-3 h-3 mr-1 text-emerald-400" />
                https://qa-portal.veris.com.ec/consentimiento
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] shrink-0">
              <span className="text-cyan-400 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-1"></span>
                CDP Active
              </span>
              <span className="text-slate-500">1280×800</span>
            </div>
          </div>

          {/* Browser Stage / Interactive Web Mockup */}
          <div className="flex-1 bg-slate-900/40 p-4 flex items-center justify-center overflow-auto relative">
            {/* Mocked Application in Target System */}
            <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-6 relative">
              {/* Portal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    V
                  </div>
                  <span className="text-xs font-bold text-white font-mono">PORTAL PACIENTE VERIS</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Paciente: <span className="text-cyan-300">•••415</span> (QA-PATIENT-5A92)
                </div>
              </div>

              {/* Modal or Content */}
              {!consentAcceptedLocally ? (
                <div className="bg-slate-900 border border-cyan-500/40 rounded-lg p-4 space-y-3 relative">
                  {/* Visual target highlight box indicating Playwright locator */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-white">Consentimiento de Tratamiento de Datos</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">
                      LOPDP v7
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Autorizo a Veris S.A. el tratamiento seguro de mis datos personales de salud con fines de agendamiento y atención médica digital, conforme a la normativa vigente.
                  </p>

                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded font-mono"
                    >
                      Rechazar
                    </button>
                    <div className="relative group">
                      {/* Playwright target indicator ring */}
                      <span className="absolute -inset-1 rounded-lg bg-cyan-500/30 animate-pulse"></span>
                      <button
                        data-testid="consent-accept"
                        onClick={() => {
                          setConsentAcceptedLocally(true);
                          stepNextAction(activeCase.id);
                        }}
                        className="relative px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded font-mono transition-all flex items-center space-x-1.5 shadow-lg shadow-cyan-900/30"
                      >
                        <Check className="w-3 h-3" />
                        <span>Aceptar</span>
                      </button>
                    </div>
                  </div>

                  {/* Playwright / CDP Inspector Floating Badge */}
                  <div className="absolute -bottom-3 left-3 bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[9px] font-mono px-2 py-0.5 rounded shadow">
                    locator: [data-testid="consent-accept"] (confidence: 0.96)
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white font-mono">Consentimiento Registrado</div>
                  <p className="text-[11px] text-slate-400">
                    Transición de estado completada. Modal cerrado y postcondición verificada en PostgreSQL.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Declarative Spanish Playbook & Steps (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 flex flex-col overflow-hidden">
          <div className="h-9 border-b border-slate-800 bg-slate-900/60 px-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              PLAYBOOK EN ESPAÑOL
            </span>
            <span className="text-[10px] text-slate-500">Compilador Determinista</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {activeCase.steps.map((step, idx) => {
              const isCompleted = step.status === 'COMPLETED';
              const isRunning = step.status === 'RUNNING';
              const isFailed = step.status === 'FAILED';
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border transition-all text-xs font-mono ${
                    isRunning
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200'
                      : isCompleted
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                      : isFailed
                      ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                      : 'bg-slate-950 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isRunning ? (
                        <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                      ) : isFailed ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block shrink-0"></span>
                      )}
                      <span className={`truncate font-medium ${isRunning ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : ''}`}>
                        {step.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-[10px] shrink-0">
                      {step.risk === 'state_change' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-800/40">
                          STATE CHANGING
                        </span>
                      )}
                      {step.durationMs && (
                        <span className="text-slate-500">{step.durationMs}ms</span>
                      )}
                    </div>
                  </div>

                  {step.expected && (
                    <div className="text-[10px] text-slate-400 mt-1 pl-5">
                      Expectativa: {step.expected}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Multi-Tab Drawer (Pages 38-39) */}
      <div className="h-64 shrink-0 bg-slate-900 border-t border-slate-800 flex flex-col overflow-hidden">
        {/* Tab Headers */}
        <div className="h-8 border-b border-slate-800 bg-slate-950/80 px-2 flex items-center space-x-1 shrink-0 overflow-x-auto text-xs font-mono">
          {(
            [
              { id: 'timeline', label: 'Timeline Web→API→DB' },
              { id: 'network', label: 'Network (CDP)' },
              { id: 'api', label: 'API' },
              { id: 'database', label: 'Database' },
              { id: 'console', label: 'Console' },
              { id: 'evidence', label: 'Evidence' },
              { id: 'ai-decisions', label: 'AI Decisions & Healing' }
            ] as const
          ).map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-3 text-xs font-mono scrollbar-thin">
          {activeTab === 'timeline' && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center text-slate-400 pb-1 border-b border-slate-800 text-[10px]">
                <span className="w-24">TIMESTAMP</span>
                <span className="w-16">LAYER</span>
                <span className="flex-1">ACTION / CORRELATION SPAN</span>
                <span className="w-24 text-right">STATUS / TIMING</span>
              </div>
              {telemetrySpans.map(s => (
                <div key={s.id} className="flex items-center py-1 hover:bg-slate-800/40 rounded px-1">
                  <span className="w-24 text-slate-500">{s.timestamp}</span>
                  <span className={`w-16 uppercase font-bold text-[10px] ${
                    s.component === 'web' ? 'text-indigo-400' : s.component === 'api' ? 'text-cyan-400' : s.component === 'db' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {s.component}
                  </span>
                  <span className="flex-1 text-slate-200 truncate">{s.action}</span>
                  <span className="w-24 text-right">
                    {s.status === 'OK' ? (
                      <span className="text-emerald-400">{s.durationMs} ms ✓</span>
                    ) : s.status === 'PENDING' ? (
                      <span className="text-amber-400">pending →</span>
                    ) : (
                      <span className="text-rose-400">ERROR</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-2 text-[11px]">
              <div className="text-slate-400 text-[10px] mb-1">
                Telemetría CDP capturada en Chromium (Network domain). Headers inyectados con X-Veris-QA-Run-ID.
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-cyan-300 font-semibold">
                  <span>POST /api/v1/consentimiento</span>
                  <span className="text-emerald-400">200 OK (153ms)</span>
                </div>
                <div className="text-slate-400 text-[10px]">Request Headers:</div>
                <div className="text-slate-500 pl-2 text-[10px]">
                  Authorization: Bearer [REDACTED]<br />
                  X-Veris-QA-Run-ID: RUN-1882<br />
                  Content-Type: application/json
                </div>
                <div className="text-slate-400 text-[10px] pt-1">Payload (Sanitizado con HMAC):</div>
                <pre className="text-slate-300 bg-slate-900/80 p-1.5 rounded text-[10px]">
{JSON.stringify({
  patientId: 'HMAC:87f1c90a12e',
  codigo_cliente: '•••415',
  version: 'LOPDP_v7',
  decision: 'ACEPTADO',
  timestamp: '2026-09-16T10:32:01.159Z'
}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-2">
              <div className="text-slate-300 font-semibold text-xs">HTTP API Assertion:</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
                <div className="text-emerald-400">✓ Status Code: 200 OK</div>
                <div className="text-emerald-400">✓ Latency: 153ms &lt; 300ms SLO threshold</div>
                <div className="text-emerald-400">✓ Schema: Matches OpenAPI schema ConsentimientoResponse</div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-2">
              <div className="text-slate-300 font-semibold text-xs">PostgreSQL State Transition Assertion:</div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="text-slate-400">
                  Target: <span className="text-cyan-300 font-semibold">clinica.consentimientos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">estado:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 line-through">NULL</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60">
                    ACEPTADO
                  </span>
                  <span className="text-emerald-400 text-[10px] ml-2">✓ Verified via read-only replica probe</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div className="text-slate-500">[CDP Runtime] Context created (id=1, origin=https://qa-portal.veris.com.ec)</div>
              <div className="text-slate-400">[info] Page navigation finished to /consentimiento</div>
              <div className="text-slate-400">[info] Modal dialog #dialog-consentimiento attached to DOM</div>
              <div className="text-emerald-400">[Playwright] Locator resolved: [data-testid="consent-accept"] in 14ms</div>
              <div className="text-slate-500">[CDP Network] Response received for /api/v1/consentimiento</div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-2">
              <div className="text-slate-300 font-semibold text-xs">Artifacts & Evidence Store:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-300 text-xs">
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Screenshot Post-Click</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">artifact_id: art-screen-4190.png</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-300 text-xs">
                    <FileCode className="w-3 h-3 text-indigo-400" />
                    <span>DOM Snapshot</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">artifact_id: dom-snap-4190.json</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-300 text-xs">
                    <Activity className="w-3 h-3 text-amber-400" />
                    <span>OTel Trace Spans</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">trace_id: tr-8821-f09</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-decisions' && (
            <div className="space-y-3">
              {aiDecisions.map(aid => (
                <div key={aid.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white text-xs">{aid.stepName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        Confidence: {(aid.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{aid.timestamp}</span>
                  </div>

                  <div className="text-slate-300 text-xs">{aid.decision}</div>

                  {aid.healingDetails && (
                    <div className="p-2.5 rounded bg-amber-950/20 border border-amber-800/40 space-y-2">
                      <div className="flex items-center justify-between text-amber-300 font-semibold text-xs">
                        <span>SELF-HEALING DETECTADO</span>
                        <span className="text-[10px] font-normal text-amber-200">
                          {aid.healingDetails.approved ? 'APROBADO ✓' : 'REQUIERE APROBACIÓN'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <div className="text-slate-500">Selector anterior:</div>
                          <code className="text-rose-400 bg-slate-900 px-1 py-0.5 rounded block mt-0.5">
                            {aid.healingDetails.oldSelector}
                          </code>
                        </div>
                        <div>
                          <div className="text-slate-500">Nuevo selector inferido:</div>
                          <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded block mt-0.5">
                            {aid.healingDetails.newSelector}
                          </code>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400">
                        Razón: {aid.healingDetails.reason}
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => approveSelfHealing(aid.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-medium flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Aprobar healing</span>
                        </button>
                        <button
                          onClick={() => rejectSelfHealing(aid.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium flex items-center space-x-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Rechazar</span>
                        </button>
                        <button
                          onClick={() => setShowDomDiff(!showDomDiff)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] font-medium"
                        >
                          {showDomDiff ? 'Ocultar diferencia DOM' : 'Ver diferencia DOM'}
                        </button>
                      </div>

                      {showDomDiff && (
                        <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-300 mt-2">
{`- <button id="btnAceptar" class="btn-primary">Aceptar</button>
+ <button data-testid="consent-accept" aria-label="Aceptar" class="btn-primary-v3">Aceptar</button>`}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
