import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Play, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export const SuitesView: React.FC = () => {
  const { currentEnv, setActiveNav } = useApp();

  const suites = [
    {
      id: 'suite-01',
      name: 'Regresión Completa Core Salud & Facturación',
      casesCount: 42,
      lastRun: 'Hoy 04:00 AM (Scheduled)',
      passRate: '97.6%',
      status: 'HEALTHY',
      cron: '0 4 * * *'
    },
    {
      id: 'suite-02',
      name: 'Smoke Test Release Gate',
      casesCount: 12,
      lastRun: 'Hoy 09:15 AM',
      passRate: '100%',
      status: 'HEALTHY',
      cron: 'Manual / Webhook'
    },
    {
      id: 'suite-03',
      name: 'Integración Consentimientos & Convenios (Web+API+DB)',
      casesCount: 8,
      lastRun: 'Hoy 10:25 AM',
      passRate: '87.5% (1 self-healed)',
      status: 'WARNING',
      cron: 'Cada 2 horas'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">SUITES DE PRUEBA</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Orquestación Continua
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Agrupaciones lógicas de casos para pipelines CI/CD, pruebas de humo y regresión programada.
          </p>
        </div>

        <button
          onClick={() => alert('Crear nueva suite...')}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium"
        >
          + Nueva Suite
        </button>
      </div>

      <div className="space-y-4">
        {suites.map(s => (
          <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {s.casesCount} casos asignados · Frecuencia: {s.cron}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-cyan-300 font-bold">{s.passRate}</div>
                  <div className="text-slate-500 text-[10px]">{s.lastRun}</div>
                </div>

                <button
                  onClick={() => setActiveNav('qa-workspace')}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Lanzar Suite</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
