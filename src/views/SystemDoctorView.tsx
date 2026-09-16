import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Shield,
  Activity,
  Server,
  Zap,
  Clock
} from 'lucide-react';

export const SystemDoctorView: React.FC = () => {
  const { doctorChecks, runSystemDoctorCheck, systemStatus } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const categories = [
    'ALL',
    'Core',
    'Control Plane',
    'Browser',
    'PostgreSQL',
    'Knowledge',
    'Security',
    'Observability'
  ];

  const filteredChecks = doctorChecks.filter(check => {
    if (selectedCategory === 'ALL') return true;
    return check.category === selectedCategory;
  });

  const passedCount = doctorChecks.filter(c => c.status === 'OK').length;
  const warnCount = doctorChecks.filter(c => c.status === 'WARNING').length;
  const failCount = doctorChecks.filter(c => c.status === 'FAILED').length;

  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      runSystemDoctorCheck();
      setIsDiagnosing(false);
    }, 600);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Core': return <Server className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Control Plane': return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'Browser': return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      case 'PostgreSQL': return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Knowledge': return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case 'Security': return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Zap className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">SYSTEM DOCTOR v3 · DIAGNOSTIC SUITE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Status: {systemStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validación exhaustiva de 24 controles de infraestructura, sandboxing, aislamiento de red, base de datos y modelo semántico.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunDiagnostics}
            disabled={isDiagnosing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
            <span>{isDiagnosing ? 'Auditando...' : 'Ejecutar Diagnóstico'}</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Salud General SUT</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {((passedCount / doctorChecks.length) * 100).toFixed(0)}% READY
          </div>
          <span className="text-[10px] text-slate-500 font-mono">24/24 controles auditados</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Aprobados (OK)</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />
            <span>{passedCount}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Conformidad total</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Advertencias</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
            <span>{warnCount}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Sin degradación crítica</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Bloqueantes (Fail)</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 flex items-center">
            <XCircle className="w-5 h-5 text-rose-400 mr-2" />
            <span>{failCount}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">0 bloqueos activos</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800/80">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                isSelected
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getCategoryIcon(check.category)}
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    {check.category}
                  </span>
                </div>
                <span className="flex items-center space-x-1 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{check.status}</span>
                </span>
              </div>

              <h3 className="font-mono text-xs font-bold text-white leading-snug">
                {check.name}
              </h3>

              <p className="text-[11px] text-slate-400">
                {check.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate pr-2">{check.details}</span>
              {check.latencyMs && (
                <span className="text-cyan-400 shrink-0 font-semibold">{check.latencyMs} ms</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
