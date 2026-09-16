import React from 'react';
import { useApp } from '../context/AppContext';
import { History, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';

export const ExecutionsHistoryView: React.FC = () => {
  const { currentEnv, setActiveNav, setSelectedCaseId } = useApp();

  const runs = [
    {
      id: 'RUN-1882',
      caseCode: 'CU-019',
      caseName: 'Aceptación de consentimiento informado con convenio activo',
      timestamp: 'Hoy 10:32:01',
      environment: 'QA',
      duration: '1.42s',
      status: 'PASS',
      healed: true,
      spansCount: 4
    },
    {
      id: 'RUN-1880',
      caseCode: 'CU-021',
      caseName: 'Validación de cobertura de aseguradora sin copago',
      timestamp: 'Hoy 10:28:14',
      environment: 'QA',
      duration: '0.88s',
      status: 'PASS',
      healed: false,
      spansCount: 3
    },
    {
      id: 'RUN-1875',
      caseCode: 'CU-082',
      caseName: 'Bloqueo de prescripción médica sin firma electrónica',
      timestamp: 'Hoy 09:50:22',
      environment: 'QA',
      duration: '2.10s',
      status: 'PASS',
      healed: false,
      spansCount: 5
    },
    {
      id: 'RUN-1870',
      caseCode: 'CU-044',
      caseName: 'Agendamiento de cita en consultorio con convenio dental',
      timestamp: 'Ayer 18:40:02',
      environment: 'DEV',
      duration: '4.20s',
      status: 'FAIL',
      healed: false,
      spansCount: 2
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">HISTORIAL DE EJECUCIONES (RUN HISTORY)</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Traza OTel Completa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Histórico detallado con tiempos de respuesta, self-healings aplicados y telemetría por span.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
              <th className="p-3.5">Run ID</th>
              <th className="p-3.5">Caso</th>
              <th className="p-3.5">Fecha / Hora</th>
              <th className="p-3.5">Ambiente</th>
              <th className="p-3.5">Duración</th>
              <th className="p-3.5 text-center">Estado</th>
              <th className="p-3.5 text-center">Self-Heal</th>
              <th className="p-3.5 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(r => (
              <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5 font-bold text-cyan-400">{r.id}</td>
                <td className="p-3.5 text-white">
                  <span className="font-semibold text-slate-400 mr-1.5">[{r.caseCode}]</span>
                  <span>{r.caseName}</span>
                </td>
                <td className="p-3.5 text-slate-400">{r.timestamp}</td>
                <td className="p-3.5 text-slate-300">{r.environment}</td>
                <td className="p-3.5 text-slate-300">{r.duration}</td>
                <td className="p-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.status === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  {r.healed ? (
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                      HEALED (0.94)
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => {
                      setSelectedCaseId('tc-019');
                      setActiveNav('qa-workspace');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] border border-slate-700"
                  >
                    Ver Trazas →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
