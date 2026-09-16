import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Play, Plus, Search, Filter, Globe, Smartphone, Database, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const TestCaseCatalogView: React.FC = () => {
  const { testCases, setSelectedCaseId, setActiveNav, runTestCase } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = testCases.filter(t =>
    t.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">CATÁLOGO DE CASOS DE PRUEBA</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {testCases.length} Casos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Casos estructurados con precondiciones comprobadas, playbooks en español y aserciones Web→API→DB.
          </p>
        </div>

        <button
          onClick={() => alert('Generando caso asistido por Playbook Compiler...')}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Caso QA</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Buscar por código CU-xxx, nombre, precondición..."
          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(tc => {
          const isRunning = tc.status === 'RUNNING';
          const isPass = tc.status === 'PASS';
          const isFail = tc.status === 'FAIL';

          return (
            <div
              key={tc.id}
              className={`p-4 rounded-xl bg-slate-900 border transition-all space-y-3 ${
                isRunning
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {tc.code}
                    </span>
                    <h3 className="text-sm font-bold text-white">{tc.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPass
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isFail
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isRunning
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tc.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1.5 leading-relaxed">{tc.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCaseId(tc.id);
                      runTestCase(tc.id);
                      setActiveNav('qa-workspace');
                    }}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs flex items-center space-x-1.5 transition-colors font-semibold"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ejecutar</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCaseId(tc.id);
                      setActiveNav('qa-workspace');
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs border border-slate-700"
                  >
                    Workspace →
                  </button>
                </div>
              </div>

              {/* Preconditions list */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-500 font-semibold uppercase text-[10px]">Precondiciones Deterministas:</div>
                <div className="space-y-0.5">
                  {tc.preconditions.map((p, i) => (
                    <div key={i} className="text-slate-300 flex items-center space-x-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom bar: Channels & Steps count */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center space-x-3">
                  <span>{tc.steps.length} pasos en playbook</span>
                  <span>·</span>
                  <span>Canales: {tc.channels.join(' → ')}</span>
                  <span>·</span>
                  <span>Requisitos: {tc.coverageRequirements.join(', ')}</span>
                </div>
                <div>Último run: {tc.lastRun || 'Nunca'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
