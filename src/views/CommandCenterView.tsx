import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Cpu,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Database,
  Activity,
  Layers,
  Terminal,
  ChevronRight,
  Server
} from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const {
    currentEnv,
    setActiveNav,
    setSelectedCaseId,
    testCases,
    requirements,
    testDataProfiles,
    systemStatus
  } = useApp();

  const runningCases = testCases.filter(c => c.status === 'RUNNING');
  const passCases = testCases.filter(c => c.status === 'PASS').length;
  const totalCompleted = testCases.filter(c => c.status === 'PASS' || c.status === 'FAIL').length || 1;
  const passRate = ((passCases / totalCompleted) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / System State */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">COMMAND CENTER</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-mono">
              Ambiente {currentEnv}
            </span>
            <span className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>{systemStatus}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma de ingeniería QA autónoma, verificable y gobernada. La verdad proviene de PostgreSQL, Playwright+CDP y el catálogo real.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCaseId('tc-019');
              setActiveNav('qa-workspace');
            }}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium font-mono flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Abrir QA Workspace</span>
          </button>
          <button
            onClick={() => setActiveNav('admin-doctor')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium font-mono border border-slate-700 transition-colors"
          >
            System Doctor
          </button>
        </div>
      </div>

      {/* Main KPI Triad from PDF page 38 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Regression Pass Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>REGRESSION SUITE</span>
            <span className="text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> ▲ 1.4%
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">96.8%</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Pass rate verificado</span>
            <span className="text-slate-400 font-mono">482 tests</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '96.8%' }}></div>
          </div>
        </div>

        {/* Requirements Coverage */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>REQUIREMENTS COVERAGE</span>
            <span className="text-amber-400 font-mono text-[11px]">14 uncovered</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">94.2%</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Documentos: Consentimiento + DERCAS</span>
            <span className="text-cyan-400 font-mono cursor-pointer hover:underline" onClick={() => setActiveNav('qa-requirements')}>
              Ver matriz →
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        {/* Autonomous QA Ratio */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>AUTONOMOUS QA</span>
            <span className="text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> ▲ 6.2%
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">78%</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>End-to-End autónomo verificado</span>
            <span className="text-slate-400 font-mono">0 falsos PASS</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>

      {/* SLA & Governance Guardrails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="text-slate-400 text-[10px]">API CONTROL PLANE p95</div>
          <div className="text-base font-semibold text-slate-200 mt-0.5">142 ms</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">SLO &lt; 300 ms (PASS)</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="text-slate-400 text-[10px]">LOCAL CATALOG SEARCH p95</div>
          <div className="text-base font-semibold text-slate-200 mt-0.5">84 ms</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">SLO &lt; 200 ms (PASS)</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="text-slate-400 text-[10px]">DATABASE GROUNDING</div>
          <div className="text-base font-semibold text-slate-200 mt-0.5">99.1%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">0 unknown columns</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="text-slate-400 text-[10px]">EXTERNAL LLM SENSITIVE DATA</div>
          <div className="text-base font-semibold text-emerald-400 mt-0.5">0 bytes</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Canary tests: 100% clean</div>
        </div>
      </div>

      {/* Two Column Section: Live Executions & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Executions Panel (2 columns wide) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-slate-200">EJECUCIONES EN VIVO</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Worker pool: 8 active</span>
          </div>

          <div className="space-y-2">
            {testCases.map((tc) => {
              const isRunning = tc.status === 'RUNNING';
              return (
                <div
                  key={tc.id}
                  onClick={() => {
                    setSelectedCaseId(tc.id);
                    setActiveNav('qa-workspace');
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isRunning
                      ? 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-400'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">{tc.code}</span>
                      <span className="text-slate-200 text-xs font-medium">{tc.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isRunning ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tc.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3 font-mono">
                      <span>Canales: {tc.channels.join(' → ')}</span>
                      <span>·</span>
                      <span>Ambiente: {tc.environment}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right font-mono text-xs">
                      {isRunning ? (
                        <div className="text-cyan-400 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                          <span>STEP 4/7 · Web → API → DB</span>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">{tc.lastRun}</div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & Quality Gate Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-slate-200">ALERTAS Y GOBERNANZA</h2>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>2 casos flaky detectados</span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                CU-021 presentó timeout en reconexión mobile. Se requiere probe específico de estado pendiente.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Knowledge Model sincronizado</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Catálogo transaccional sincronizado hace 22 min. 142 tablas, 89 FKs, 18 patrones verificados.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-200 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>SSRF & Redaction Canaries</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                100% de canaries pasados. Cero datos de pacientes o historias clínicas expuestos en logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
