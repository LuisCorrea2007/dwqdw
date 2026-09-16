import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  Server,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Database
} from 'lucide-react';
import { EnvironmentType } from '../types';

export const EnvironmentsView: React.FC = () => {
  const { currentEnv, setCurrentEnv } = useApp();

  const envsInfo: {
    type: EnvironmentType;
    title: string;
    description: string;
    dbPolicy: string;
    learningPolicy: string;
    mutationPolicy: string;
    color: string;
  }[] = [
    {
      type: 'DEV',
      title: 'Desarrollo Local',
      description: 'Entorno de iteración para ingenieros de QA y experimentación controlada.',
      dbPolicy: 'PostgreSQL Read/Write en schemas de prueba',
      learningPolicy: 'Auto-learning interactivo habilitado',
      mutationPolicy: 'Permitida bajo transacción rollback',
      color: 'border-slate-700'
    },
    {
      type: 'QA',
      title: 'Quality Assurance (Principal)',
      description: 'Automatización completa aprobada, ejecución multi-ciclo, leasing y validación Web→API→DB.',
      dbPolicy: 'PostgreSQL Read-Only + Test Data Resolver con leases',
      learningPolicy: 'Discovery + Interactive Learning con políticas explícitas',
      mutationPolicy: 'A través de fixtures y APIs aprobadas con teardown',
      color: 'border-cyan-500/50'
    },
    {
      type: 'UAT',
      title: 'User Acceptance Testing',
      description: 'Automatización completa pero con quality gates más estrictos antes de release.',
      dbPolicy: 'PostgreSQL Read-Only replica dedicada',
      learningPolicy: 'Solo playbooks verificados previamente',
      mutationPolicy: 'Prohibida sin autorización de Data Steward',
      color: 'border-indigo-500/40'
    },
    {
      type: 'PREPROD',
      title: 'Pre-Producción (Staging)',
      description: 'Solo suites certificadas y staging shadow mode para observar ejecuciones humanas.',
      dbPolicy: 'PostgreSQL Staging Read-Only',
      learningPolicy: 'Shadow mode pasivo (humano vs playbook generado)',
      mutationPolicy: 'Bloqueada por default',
      color: 'border-amber-500/40'
    },
    {
      type: 'PROD',
      title: 'Producción Observacional',
      description: 'Observación pasiva por defecto. Cero mutaciones, 0 escrituras SQL automáticas, credenciales aisladas.',
      dbPolicy: 'PostgreSQL Credencial estricta sin privilegios de escritura',
      learningPolicy: 'No auto-learning interactivo',
      mutationPolicy: 'ESTRICTAMENTE PROHIBIDA (0 mutaciones)',
      color: 'border-rose-500/60'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">POLÍTICAS Y AMBIENTES</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Separación Estricta de Entornos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "La seguridad no debe depender solo de un if(env == 'PROD'), sino de credenciales a nivel de base de datos sin permisos de escritura."
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span>Ambiente seleccionado: </span>
          <span className="text-cyan-300 font-bold">{currentEnv}</span>
        </div>
      </div>

      {/* Grid of Environments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {envsInfo.map(env => {
          const isCurrent = env.type === currentEnv;
          return (
            <div
              key={env.type}
              className={`p-4 rounded-xl bg-slate-900 border transition-all space-y-3 ${
                isCurrent
                  ? `${env.color} ring-2 ring-cyan-500/20 shadow-lg`
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">{env.type}</span>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800">
                    ACTIVO
                  </span>
                )}
              </div>

              <div className="font-semibold text-slate-200 text-xs">{env.title}</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{env.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                <div>
                  <span className="text-slate-500">DB Policy: </span>
                  <span className="text-slate-300">{env.dbPolicy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Learning: </span>
                  <span className="text-slate-300">{env.learningPolicy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mutation: </span>
                  <span className={env.type === 'PROD' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {env.mutationPolicy}
                  </span>
                </div>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => setCurrentEnv(env.type)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
                >
                  Conmutar a {env.type}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
