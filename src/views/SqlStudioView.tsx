import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Terminal,
  Play,
  PlaySquare,
  Sparkles,
  StopCircle,
  FileCode2,
  Database,
  ChevronRight,
  ChevronDown,
  Copy,
  Download,
  Check,
  AlertCircle,
  TrendingDown,
  Layers,
  ArrowRight,
  Clock,
  Zap,
  Info
} from 'lucide-react';

export const SqlStudioView: React.FC = () => {
  const { databaseTables, addTelemetrySpan, currentEnv } = useApp();

  const [activeTab, setActiveTab] = useState<'results' | 'explain' | 'advisor'>('results');
  const [selectedEditorTab, setSelectedEditorTab] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSchemas, setExpandedSchemas] = useState<Record<string, boolean>>({
    comercial: true,
    clinica: true,
    agenda: false
  });

  const queryTabs = [
    {
      title: 'Convenios de Paciente',
      sql: `-- SQL Studio: Consulta con JOIN determinista y control de sensibilidad
SELECT 
  a.codigo_cliente,
  c.codigo_convenio,
  c.nombre_convenio,
  a.es_activo,
  c.estado AS estado_convenio
FROM comercial.com_afiliados_x_cliente a
JOIN comercial.com_convenios_clientes c 
  ON c.codigo_convenio = a.codigo_convenio
WHERE a.codigo_cliente = 415
  AND a.es_activo = 'S'
  AND c.estado = 'A';`
    },
    {
      title: 'Consentimiento LOPDP',
      sql: `-- Verificación de estado de consentimiento y versión legal
SELECT 
  id_consentimiento,
  id_paciente,
  estado,
  version_documento,
  fecha_registro
FROM clinica.consentimientos
WHERE id_paciente = 415
ORDER BY fecha_registro DESC
LIMIT 5;`
    },
    {
      title: 'Auditoría Citas',
      sql: `-- Citas agendadas sin violar reglas de exportación PII
SELECT 
  id_cita,
  codigo_cliente,
  id_medico,
  especialidad,
  estado_cita
FROM agenda.citas
WHERE codigo_cliente = 415
ORDER BY id_cita DESC;`
    }
  ];

  const [currentSql, setCurrentSql] = useState<string>(queryTabs[0].sql);

  const [resultData, setResultData] = useState<{
    columns: string[];
    rows: (string | number)[][];
    executionTimeMs: number;
    rowCount: number;
  }>({
    columns: ['codigo_cliente', 'codigo_convenio', 'nombre_convenio', 'es_activo', 'estado_convenio'],
    rows: [
      [415, 102, 'CONVENIO CORPORATIVO VERIS PLUS', 'S', 'A'],
      [415, 108, 'PLAN DENTAL COMPLEMENTARIO', 'S', 'A']
    ],
    executionTimeMs: 28,
    rowCount: 2
  });

  const toggleSchema = (schema: string) => {
    setExpandedSchemas(prev => ({ ...prev, [schema]: !prev[schema] }));
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setResultData({
        columns: ['codigo_cliente', 'codigo_convenio', 'nombre_convenio', 'es_activo', 'estado_convenio'],
        rows: [
          [415, 102, 'CONVENIO CORPORATIVO VERIS PLUS', 'S', 'A'],
          [415, 108, 'PLAN DENTAL COMPLEMENTARIO', 'S', 'A']
        ],
        executionTimeMs: Math.floor(Math.random() * 25 + 15),
        rowCount: 2
      });
      addTelemetrySpan({
        traceId: 'tr-sql-' + Date.now().toString().slice(-4),
        runId: 'SQL-STUDIO',
        caseId: 'ADHOC',
        stepId: 'query',
        environment: currentEnv,
        component: 'db',
        action: 'EXECUTED_SELECT_READONLY: comercial.com_afiliados_x_cliente',
        durationMs: 28,
        status: 'OK'
      });
    }, 350);
  };

  const handleCopyRows = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">SQL STUDIO & QUERY PLAN ANALYZER</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              PostgreSQL SUT Read-Only
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Entorno de pruebas y validación SQL con políticas de cursor seguro, EXPLAIN ANALYZE y recomendador de índices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar (F5)'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('explain'); handleRun(); }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explain Seguro</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-mono border border-purple-800/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimization Advisor</span>
          </button>
        </div>
      </div>

      {/* Main Split: DB Explorer (3 cols) + Editor & Results (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Schema Tree (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[650px] overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Esquemas SUT</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">veris_qa_db</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs font-mono scrollbar-thin">
            {['comercial', 'clinica', 'agenda'].map((schemaName) => {
              const isExpanded = !!expandedSchemas[schemaName];
              const tablesInSchema = databaseTables.filter(t => t.schema === schemaName);

              return (
                <div key={schemaName} className="space-y-1">
                  <button
                    onClick={() => toggleSchema(schemaName)}
                    className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-slate-800/60 text-slate-300 font-semibold"
                  >
                    <div className="flex items-center space-x-1.5">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="text-cyan-300">{schemaName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{tablesInSchema.length}</span>
                  </button>

                  {isExpanded && (
                    <div className="pl-4 space-y-1 border-l border-slate-800 ml-3">
                      {tablesInSchema.map((tbl) => (
                        <div key={tbl.name} className="space-y-0.5">
                          <button
                            onClick={() => {
                              setCurrentSql(`SELECT * FROM ${tbl.schema}.${tbl.name} LIMIT 50;`);
                            }}
                            className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center justify-between group"
                          >
                            <span className="truncate">{tbl.name}</span>
                            <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100">SELECT</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 text-[10px] font-mono text-slate-400">
            <div>Timeout: <span className="text-cyan-400">5000 ms</span></div>
            <div>Isolation: <span className="text-emerald-400">READ COMMITTED</span></div>
          </div>
        </div>

        {/* Right: SQL Editor + Results / Explain / Advisor (9 cols) */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          {/* Editor Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2 pt-1.5">
              <div className="flex items-center space-x-1">
                {queryTabs.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedEditorTab(idx);
                      setCurrentSql(q.sql);
                    }}
                    className={`px-3 py-1.5 rounded-t-lg text-xs font-mono transition-colors flex items-center space-x-1.5 ${
                      selectedEditorTab === idx
                        ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <FileCode2 className="w-3 h-3 text-slate-500" />
                    <span>{q.title}</span>
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-500 pr-2">
                Dialect: <span className="text-slate-300">PostgreSQL 16</span>
              </div>
            </div>

            {/* Monaco-style Code Input */}
            <div className="relative bg-slate-950/80 p-3 font-mono text-xs">
              <textarea
                value={currentSql}
                onChange={(e) => setCurrentSql(e.target.value)}
                rows={7}
                className="w-full bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-cyan-500/20"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Tabs: Results | Explain | Advisor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2">
              <div className="flex items-center space-x-4 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`pb-1 border-b-2 font-semibold transition-colors ${
                    activeTab === 'results'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Resultados ({resultData.rowCount})
                </button>
                <button
                  onClick={() => setActiveTab('explain')}
                  className={`pb-1 border-b-2 font-semibold transition-colors ${
                    activeTab === 'explain'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Plan de Ejecución (EXPLAIN)
                </button>
                <button
                  onClick={() => setActiveTab('advisor')}
                  className={`pb-1 border-b-2 font-semibold transition-colors ${
                    activeTab === 'advisor'
                      ? 'border-purple-400 text-purple-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Optimization Advisor
                </button>
              </div>

              {activeTab === 'results' && (
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px] mr-2">
                    Tiempo: <span className="text-emerald-400 font-semibold">{resultData.executionTimeMs} ms</span>
                  </span>
                  <button
                    onClick={handleCopyRows}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab 1: Result Table */}
            {activeTab === 'results' && (
              <div className="flex-1 overflow-x-auto overflow-y-auto p-2">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      {resultData.columns.map(col => (
                        <th key={col} className="p-2.5">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {resultData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/30">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-200">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: EXPLAIN ANALYZE View */}
            {activeTab === 'explain' && (
              <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300 font-bold">COSTO TOTAL ESTIMADO: 48.25 .. 112.50</span>
                  <span className="text-emerald-400">Index Scan Verified (Sin Sequential Scan en tablas grandes)</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-[11px] text-slate-300 leading-relaxed">
                  <div className="text-cyan-300 font-bold">
                    -&gt; Nested Loop (cost=0.56..12.80 rows=2 width=142) (actual time=0.038..0.045 rows=2 loops=1)
                  </div>
                  <div className="pl-4 text-emerald-400">
                    -&gt; Index Scan using pk_afiliados on comercial.com_afiliados_x_cliente a (cost=0.28..8.30 rows=1 width=18)
                    <div className="text-slate-500 pl-4">Index Cond: (codigo_cliente = 415)</div>
                    <div className="text-slate-500 pl-4">Filter: (es_activo = 'S')</div>
                  </div>
                  <div className="pl-4 text-indigo-300">
                    -&gt; Index Scan using pk_convenios on comercial.com_convenios_clientes c (cost=0.28..4.50 rows=1 width=124)
                    <div className="text-slate-500 pl-4">Index Cond: (codigo_convenio = a.codigo_convenio)</div>
                    <div className="text-slate-500 pl-4">Filter: (estado = 'A')</div>
                  </div>
                  <div className="pt-2 text-slate-400 text-[10px] border-t border-slate-900">
                    Planning Time: 0.124 ms · Execution Time: 0.082 ms · Shared hit blocks: 8 (0 disk reads)
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Optimization Advisor */}
            {activeTab === 'advisor' && (
              <div className="p-4 space-y-4 font-mono text-xs">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>RECOMENDACIONES DEL ASESOR DE ÍNDICES Y PLANES:</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-purple-900/40 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-slate-100 font-bold text-sm">
                        Optimización #1: Índice compuesto en <code className="text-cyan-300">com_afiliados_x_cliente(codigo_cliente, es_activo)</code>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        El filtro <code className="text-slate-300">es_activo = 'S'</code> actualmente se evalúa en memoria tras el index scan primario. Un índice compuesto evitaría el filtro post-búsqueda.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                      -28% Latencia
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300">
                    <div className="text-slate-500 mb-1">Sentencia DDL recomendada para Environment Admin:</div>
                    <code>CREATE INDEX CONCURRENTLY idx_afiliados_cliente_activo ON comercial.com_afiliados_x_cliente(codigo_cliente, es_activo);</code>
                  </div>

                  <div className="flex items-center text-[10px] text-slate-400">
                    <Info className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                    <span>Gobernanza: SQL Studio es estricto Read-Only; las optimizaciones DDL requieren aprobación de DBA / Environment Admin.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
