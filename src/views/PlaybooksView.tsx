import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Shield,
  Layers,
  Code2
} from 'lucide-react';
import { PlaybookState } from '../types';

export const PlaybooksView: React.FC = () => {
  const { currentEnv, testCases, setSelectedCaseId, setActiveNav } = useApp();

  const playbookStates: PlaybookState[] = [
    'DISCOVERED',
    'GENERATED',
    'PREFLIGHTED',
    'REPLAYED',
    'VERIFIED',
    'TRUSTED'
  ];

  const [selectedPlaybook] = useState({
    title: 'Aceptar consentimiento',
    environment: 'QA',
    state: 'VERIFIED' as PlaybookState,
    preconditions: [
      'Paciente autenticado',
      'Consentimiento vigente pendiente'
    ],
    steps: [
      {
        action: 'esperar_elemento',
        target: { role: 'dialog', name: 'Consentimiento' },
        expected: 'El formulario debe estar visible'
      },
      {
        action: 'click',
        target: { role: 'button', name: 'Aceptar' },
        risk: 'state_change'
      }
    ]
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">PLAYBOOKS EN ESPAÑOL</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Lenguaje Declarativo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Los pasos generados son playbooks estructurados en español, no código Playwright improvisado ni alucinaciones.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Ambiente: <span className="text-cyan-300 font-bold">{currentEnv}</span>
        </div>
      </div>

      {/* State Machine Pipeline (Matching PDF page 6) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="text-slate-400 uppercase font-semibold text-[11px]">
          Pipeline de Confianza y Promoción de Playbooks:
        </span>

        <div className="flex items-center justify-between overflow-x-auto py-2">
          {playbookStates.map((st, idx) => {
            const isReached = idx <= 4;
            const isCurrent = st === 'VERIFIED';
            return (
              <React.Fragment key={st}>
                <div className="flex flex-col items-center space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                      : isReached
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold ${
                    isCurrent ? 'text-cyan-300' : isReached ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {st}
                  </span>
                </div>
                {idx < playbookStates.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${isReached ? 'bg-emerald-500/40' : 'bg-slate-800'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Declarative Playbook JSON Viewer (PDF Page 5) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase">Playbook: {selectedPlaybook.title}</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCaseId('tc-019');
              setActiveNav('qa-workspace');
            }}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium flex items-center space-x-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Ejecutar en Workspace</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-cyan-200 text-xs leading-relaxed overflow-x-auto">
{JSON.stringify(selectedPlaybook, null, 2)}
        </pre>
      </div>
    </div>
  );
};
