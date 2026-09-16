import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Cpu,
  Search,
  Shield,
  Table,
  CheckCircle2,
  AlertTriangle,
  Lock,
  EyeOff,
  Filter,
  Layers
} from 'lucide-react';
import { SensitivityClass } from '../types';

export const DatabaseIntelligenceView: React.FC = () => {
  const { databaseTables, currentEnv } = useApp();
  const [selectedTable, setSelectedTable] = useState(databaseTables[0]);
  const [probeResult, setProbeResult] = useState<{
    column: string;
    allowed: boolean;
    data?: { value: string; count: number }[];
    error?: string;
  } | null>(null);

  const getSensitivityBadge = (cls: SensitivityClass) => {
    switch (cls) {
      case 'PUBLIC_METADATA':
        return <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">PUBLIC</span>;
      case 'INTERNAL_METADATA':
        return <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">INTERNAL</span>;
      case 'BUSINESS_IDENTIFIER':
        return <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px] font-mono border border-indigo-800">BUS_IDENTIFIER</span>;
      case 'PII':
        return <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800">PII (MASKED)</span>;
      case 'HEALTH_SENSITIVE':
        return <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">HEALTH_SENSITIVE</span>;
      case 'AUTH_SECRET':
        return <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 text-[10px] font-mono border border-red-800">AUTH_SECRET</span>;
      default:
        return <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">UNKNOWN</span>;
    }
  };

  const runValueProbe = (colName: string, cls: SensitivityClass) => {
    if (cls === 'PII' || cls === 'HEALTH_SENSITIVE' || cls === 'AUTH_SECRET') {
      setProbeResult({
        column: colName,
        allowed: false,
        error: `POLÍTICA DE PRIVACIDAD OWASP/NIST: La columna ${colName} clasificada como ${cls} tiene muestreo prohibido (Deny by default). Cero datos de salud o pacientes enviados a la plataforma.`
      });
    } else {
      setProbeResult({
        column: colName,
        allowed: true,
        data: [
          { value: 'S (Activo)', count: 4890000 },
          { value: 'N (Inactivo)', count: 230000 }
        ]
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">DATABASE INTELLIGENCE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Catálogo PostgreSQL Introspeccionado
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mapeo semántico de tablas, columnas, restricciones (pg_constraint) y clasificación estricta de sensibilidad.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span>Catalog reltuples: </span>
          <span className="text-cyan-300 font-bold">{selectedTable.rowCountEstimate.toLocaleString()} filas estimadas</span>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {databaseTables.map(tbl => {
          const isSelected = tbl.name === selectedTable.name;
          return (
            <button
              key={`${tbl.schema}.${tbl.name}`}
              onClick={() => {
                setSelectedTable(tbl);
                setProbeResult(null);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center space-x-2 ${
                isSelected
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{tbl.schema}.{tbl.name}</span>
            </button>
          );
        })}
      </div>

      {/* Schema & Columns Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-xs">Esquema:</span>
            <span className="text-cyan-400 font-bold">{selectedTable.schema}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 text-xs">Tabla:</span>
            <span className="text-white font-bold">{selectedTable.name}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Deny-by-default policy para sampling de PII
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px]">
              <th className="p-3">Columna</th>
              <th className="p-3">Tipo PostgreSQL</th>
              <th className="p-3">Constraints</th>
              <th className="p-3">Clasificación Sensibilidad</th>
              <th className="p-3 text-center">Sampling</th>
              <th className="p-3 text-center">LLM Externo</th>
              <th className="p-3 text-right">Muestrear Valores</th>
            </tr>
          </thead>
          <tbody>
            {selectedTable.columns.map(col => (
              <tr key={col.name} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-semibold text-slate-200">
                  <div className="flex items-center space-x-1.5">
                    {col.isPk && <span className="text-amber-400 text-[10px] font-bold">PK</span>}
                    {col.isFk && <span className="text-cyan-400 text-[10px] font-bold">FK</span>}
                    <span>{col.name}</span>
                  </div>
                  {col.comments && <div className="text-[10px] text-slate-500 font-normal">{col.comments}</div>}
                </td>
                <td className="p-3 text-cyan-300 text-[11px]">{col.dataType}</td>
                <td className="p-3 text-slate-400 text-[11px]">
                  {col.hasIndex ? <span className="text-emerald-400">INDEX (B-tree)</span> : 'None'}
                </td>
                <td className="p-3">
                  {getSensitivityBadge(col.sensitivityClass)}
                </td>
                <td className="p-3 text-center">
                  {col.samplingAllowed ? (
                    <span className="text-emerald-400">✓ Permitido</span>
                  ) : (
                    <span className="text-rose-400">✗ Prohibido</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {col.externalLlmAllowed ? (
                    <span className="text-emerald-400">✓ Redactado</span>
                  ) : (
                    <span className="text-rose-400 font-bold">LOCAL ONLY</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => runValueProbe(col.name, col.sensitivityClass)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] border border-slate-700"
                  >
                    Probe Seguro
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Value Probe Result Drawer */}
      {probeResult && (
        <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
          probeResult.allowed ? 'bg-slate-900 border-cyan-500/40 text-slate-200' : 'bg-rose-950/20 border-rose-800/60 text-rose-200'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span>Muestreo de Dominio: {probeResult.column}</span>
            <span className={probeResult.allowed ? 'text-emerald-400' : 'text-rose-400'}>
              {probeResult.allowed ? 'Muestreo Autorizado' : 'Muestreo Bloqueado'}
            </span>
          </div>

          {probeResult.allowed && probeResult.data ? (
            <div className="space-y-1 pt-1">
              <div className="text-slate-400 text-[11px]">Valores de baja cardinalidad descubiertos (SELECT ... LIMIT 20):</div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {probeResult.data.map((d, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300">{d.value}</span>
                    <span className="text-slate-400">{d.count.toLocaleString()} filas</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              {probeResult.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
