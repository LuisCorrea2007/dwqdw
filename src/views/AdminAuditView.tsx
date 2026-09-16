import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScrollText, Search, ShieldCheck, Filter, Download } from 'lucide-react';

export const AdminAuditView: React.FC = () => {
  const { currentEnv } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const auditEvents = [
    {
      timestamp: "2026-09-16 10:32:01.117",
      level: "INFO",
      service: "web-worker",
      trace_id: "tr-8821-f09",
      run_id: "RUN-1882",
      case_id: "CU-019",
      step_id: "STEP-04",
      environment: "QA",
      event: "browser.action.completed",
      duration_ms: 117,
      status: "OK",
      user: "Senior QA"
    },
    {
      timestamp: "2026-09-16 10:32:00.812",
      level: "INFO",
      service: "knowledge-worker",
      trace_id: "tr-8821-f09",
      run_id: "RUN-1882",
      case_id: "CU-019",
      step_id: "STEP-01",
      environment: "QA",
      event: "test_data.lease.acquired",
      duration_ms: 28,
      status: "OK",
      user: "System Daemon"
    },
    {
      timestamp: "2026-09-16 10:31:45.020",
      level: "WARN",
      service: "api-worker",
      trace_id: "tr-8819-a11",
      run_id: "RUN-1880",
      case_id: "CU-021",
      step_id: "STEP-02",
      environment: "QA",
      event: "browser.context.reconnect.timeout",
      duration_ms: 5002,
      status: "TIMEOUT",
      user: "QA Engineer"
    },
    {
      timestamp: "2026-09-16 10:28:10.450",
      level: "INFO",
      service: "db-worker",
      trace_id: "tr-8814-c33",
      run_id: "RUN-1875",
      case_id: "CU-082",
      step_id: "STEP-02",
      environment: "QA",
      event: "sql.explain_json.verified",
      duration_ms: 6,
      status: "OK",
      user: "Data Steward"
    }
  ];

  const filtered = auditEvents.filter(e =>
    e.event.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.run_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.service.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">REGISTRO DE AUDITORÍA (AUDIT TRAIL)</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Inmutable & Cifrado
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Eventos emitidos en formato JSON estructurado con correlation IDs. Se excluyen por diseño passwords, tokens y datos sensibles.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>OWASP Structured Logging Enforced</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filtrar por evento, run_id, servicio..."
          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => alert('Exportando log de auditoría firmado criptográficamente...')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center space-x-1.5 border border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Audit Log</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Nivel</th>
              <th className="p-3.5">Servicio</th>
              <th className="p-3.5">Run ID / Caso</th>
              <th className="p-3.5">Evento Estructurado</th>
              <th className="p-3.5">Actor</th>
              <th className="p-3.5 text-right">Duración</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5 text-slate-400">{item.timestamp}</td>
                <td className="p-3.5">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    item.level === 'INFO' ? 'bg-cyan-950 text-cyan-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {item.level}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{item.service}</td>
                <td className="p-3.5 text-cyan-300">
                  <span>{item.run_id}</span>
                  <span className="text-slate-500 ml-1">({item.case_id})</span>
                </td>
                <td className="p-3.5 font-semibold text-white">{item.event}</td>
                <td className="p-3.5 text-slate-400">{item.user}</td>
                <td className="p-3.5 text-right text-emerald-400 font-bold">{item.duration_ms} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
