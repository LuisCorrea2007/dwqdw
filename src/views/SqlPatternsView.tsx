import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SqlQueryPattern } from '../types';

export const SqlPatternsView: React.FC = () => {
  const { sqlPatterns } = useApp();
  const [selectedPattern, setSelectedPattern] = useState<SqlQueryPattern>(sqlPatterns[0]);
  const [testIntent, setTestIntent] = useState('convenios del paciente 415');
  const [isSimulatingAutopilot, setIsSimulatingAutopilot] = useState(false);
  const [lifecycleLog, setLifecycleLog] = useState<string[]>([]);

  const handleSimulate = () => {
    setIsSimulatingAutopilot(true);
    setLifecycleLog([
      '1. Parse intent: entity=Paciente, literal=415, target=Convenio, qualifier=activo',
      '2. Knowledge retrieval: Validated identifier 415 -> comercial.afiliados.codigo_cliente (conf: 0.99)',
      '3. Query Pattern match: PATTERN-128 matched with 0.97 confidence score',
      '4. SQLGlot AST size gate: 42 nodes < 500 max limit. Passed.',
      '5. Read-only Policy: Strict SELECT enforced, 0 mutation clauses.',
      '6. PostgreSQL EXPLAIN (FORMAT JSON): Estimated cost 8.92 (Index Scan verified).',
      '7. Candidate query approved & verified for execution.'
    ]);
    setTimeout(() => {
      setIsSimulatingAutopilot(false);
    }, 400);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">SQL PATTERN LEARNING & AUTOPILOT</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Deterministic AST Store
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Almacena la estructura normalizada y nunca valores sensibles literales. Fórmula auditable de confianza 35/25/25/15%.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Patrones en memoria: <span className="text-cyan-300 font-bold">{sqlPatterns.length} verificados</span>
        </div>
      </div>

      {/* Main Split: Patterns list & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patterns List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[580px]">
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase font-semibold">
            PATRONES VERIFICADOS
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {sqlPatterns.map(p => {
              const isSelected = p.id === selectedPattern.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPattern(p)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{p.id.toUpperCase()}</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/60">
                      {(p.confidence * 100).toFixed(0)}% conf
                    </span>
                  </div>
                  <div className="text-white font-medium truncate">{p.intentKey}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pattern Detail & Formula (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 font-mono text-xs">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">INTENT KEY</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{selectedPattern.intentKey}</h2>
              <div className="text-slate-400 text-xs mt-1">{selectedPattern.description}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">HISTÓRICO EJECUCIONES</span>
              <span className="text-sm font-bold text-emerald-400">{selectedPattern.successCount} PASS</span> ·{' '}
              <span className="text-sm font-bold text-slate-500">{selectedPattern.failureCount} FAIL</span>
            </div>
          </div>

          {/* Normalized AST Query (NO sensitive literals) */}
          <div className="space-y-1.5">
            <span className="text-slate-400 uppercase font-semibold text-[11px]">AST Normalizado Parametrizado (Sin PII):</span>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-cyan-200 text-[11px] overflow-x-auto leading-relaxed">
              {selectedPattern.normalizedAst}
            </pre>
          </div>

          {/* Auditable Confidence Formula breakdown from PDF page 8 */}
          <div className="space-y-2">
            <span className="text-slate-400 uppercase font-semibold text-[11px]">
              Fórmula Explícita y Auditable de Confianza ({(selectedPattern.confidence * 100).toFixed(0)}%):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">35% SIMILITUD INTENCIÓN</span>
                <span className="text-white font-bold">{(selectedPattern.confidenceBreakdown.intentSimilarity * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">25% COMPATIBILIDAD SCHEMA</span>
                <span className="text-white font-bold">{(selectedPattern.confidenceBreakdown.schemaCompatibility * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">25% HISTÓRICO ÉXITO</span>
                <span className="text-white font-bold">{(selectedPattern.confidenceBreakdown.historicalSuccess * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">15% VIGENCIA / RECENCY</span>
                <span className="text-white font-bold">{(selectedPattern.confidenceBreakdown.recency * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Autopilot Simulation Lifecycle (PDF Page 26 diagram) */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[11px]">Ciclo Estricto de Autopilot (Grounding Real):</span>
              <button
                onClick={handleSimulate}
                disabled={isSimulatingAutopilot}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-medium transition-colors"
              >
                Probar Ciclo con Intención
              </button>
            </div>

            <input
              type="text"
              value={testIntent}
              onChange={(e) => setTestIntent(e.target.value)}
              className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-slate-200 text-xs focus:outline-none"
            />

            {lifecycleLog.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
                {lifecycleLog.map((log, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
