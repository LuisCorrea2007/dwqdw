import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Database,
  Shield,
  Search,
  Filter,
  Eye,
  EyeOff,
  Key,
  Lock,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Table
} from 'lucide-react';
import { SensitivityClass } from '../types';

export const DbIntelligenceView: React.FC = () => {
  const { databaseTables } = useApp();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  const selectedTable = databaseTables[selectedTableIndex] || databaseTables[0];

  const filteredTables = databaseTables.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.schema.toLowerCase().includes(search.toLowerCase())
  );

  const getSensitivityBadge = (sClass: SensitivityClass) => {
    switch (sClass) {
      case 'PII':
        return <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-mono font-semibold">PII (DATO PERSONAL)</span>;
      case 'HEALTH_SENSITIVE':
        return <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-mono font-semibold">HEALTH SENSITIVE</span>;
      case 'AUTH_SECRET':
        return <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-mono font-semibold">SECRET / CREDENTIAL</span>;
      case 'BUSINESS_IDENTIFIER':
        return <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-semibold">BUSINESS ID</span>;
      case 'INTERNAL_METADATA':
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">INTERNAL META</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">PUBLIC META</span>;
    }
  };

  const filteredColumns = selectedTable.columns.filter(col => {
    if (selectedClass === 'ALL') return true;
    return col.sensitivityClass === selectedClass;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">DATABASE INTELLIGENCE & CATALOG CLASSIFICATION</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">
              Catalog Plane
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mapeo estricto de esquemas, niveles de sensibilidad LOPDP y políticas de muestreo/exposición a modelos externos.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Tablas indexadas: <span className="text-white font-semibold">{databaseTables.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
            Regla: <span className="font-bold">Zero-Sensitive Egress</span>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-start space-x-3 text-xs text-slate-300">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-mono">
          <span className="text-cyan-300 font-bold">GOBERNANZA DE DATOS (NIST / OWASP LLM-06):</span>
          <span className="text-slate-400 ml-1.5">
            Ninguna columna clasificada como <code className="text-rose-300">PII</code>, <code className="text-amber-300">HEALTH_SENSITIVE</code> o <code className="text-purple-300">AUTH_SECRET</code> puede ser enviada a proveedores de IA externos sin anonimización previa en memoria segura con HMAC local.
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tabla o esquema..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredTables.map((tbl, idx) => {
              const isSelected = tbl.name === selectedTable.name && tbl.schema === selectedTable.schema;
              const piiCount = tbl.columns.filter(c => c.sensitivityClass === 'PII' || c.sensitivityClass === 'HEALTH_SENSITIVE').length;

              return (
                <button
                  key={`${tbl.schema}.${tbl.name}`}
                  onClick={() => setSelectedTableIndex(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 text-white border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/40 text-slate-300 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wide">
                      {tbl.schema}
                    </span>
                    {piiCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/60 text-[9px] font-mono">
                        {piiCount} PII
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-100 truncate">
                    {tbl.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                    <span>{tbl.columns.length} columnas</span>
                    <span>~{tbl.rowCountEstimate.toLocaleString()} filas</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Schema & Columns Matrix (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          {/* Header of Table */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Table className="w-4 h-4 text-cyan-400" />
                <h2 className="font-mono text-base font-bold text-white">
                  {selectedTable.schema}.{selectedTable.name}
                </h2>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Estimado: ~{selectedTable.rowCountEstimate.toLocaleString()} filas · Índices validados: {selectedTable.columns.filter(c => c.hasIndex).length}
              </p>
            </div>

            {/* Filter by classification */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todas las clasificaciones</option>
                <option value="PII">Solo PII</option>
                <option value="HEALTH_SENSITIVE">Solo Salud</option>
                <option value="BUSINESS_IDENTIFIER">Solo Business ID</option>
                <option value="INTERNAL_METADATA">Solo Metadatos</option>
              </select>
            </div>
          </div>

          {/* Columns Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[520px] p-2">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Columna</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5">Atributos</th>
                  <th className="p-2.5">Clasificación LOPDP</th>
                  <th className="p-2.5 text-center">Muestreo Seguro</th>
                  <th className="p-2.5 text-center">LLM Externo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredColumns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-2.5 font-semibold text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        {col.isPk && <Key className="w-3 h-3 text-amber-400 shrink-0" title="Primary Key" />}
                        <span>{col.name}</span>
                      </div>
                      {col.comments && (
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                          {col.comments}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-400 font-mono text-[11px]">{col.dataType}</td>
                    <td className="p-2.5 space-x-1">
                      {col.isPk && <span className="px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 text-[9px]">PK</span>}
                      {col.isFk && <span className="px-1 py-0.2 rounded bg-blue-950/80 text-blue-300 text-[9px]">FK</span>}
                      {col.hasIndex && <span className="px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 text-[9px]">INDEX</span>}
                      {!col.isNullable && <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">NOT NULL</span>}
                    </td>
                    <td className="p-2.5">{getSensitivityBadge(col.sensitivityClass)}</td>
                    <td className="p-2.5 text-center">
                      {col.samplingAllowed ? (
                        <span className="inline-flex items-center text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Permitido
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-400 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {col.externalLlmAllowed ? (
                        <span className="inline-flex items-center text-emerald-400 text-[11px]">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Permitido
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-400 text-[11px] font-semibold">
                          <EyeOff className="w-3.5 h-3.5 mr-1" /> Prohibido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
