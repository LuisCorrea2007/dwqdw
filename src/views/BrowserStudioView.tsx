import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, RefreshCw, Layers, ShieldCheck, Play, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

export const BrowserStudioView: React.FC = () => {
  const { currentEnv, setActiveNav, setSelectedCaseId } = useApp();
  const [activeCycle, setActiveCycle] = useState<number>(3);

  const cycles = [
    {
      num: 1,
      name: 'Ciclo 1: Descubrimiento',
      desc: 'Exploración pasiva del DOM, grafo de navegación y recolección de selectores semánticos.',
      status: 'COMPLETED'
    },
    {
      num: 2,
      name: 'Ciclo 2: Replay Inicial',
      desc: 'Ejecución del playbook contra selectores originales (role=button name="Aceptar").',
      status: 'FAILED (Selector Mutado)'
    },
    {
      num: 3,
      name: 'Ciclo 3: Self-Healing & Reparación',
      desc: 'Inferencia multi-candidato, cálculo de similitud 94% y reparación semántica auditable.',
      status: 'HEALED (Auto-Reparado)'
    },
    {
      num: 4,
      name: 'Ciclo 4: Playbook Verificado',
      desc: 'Playbook promovido con fallback de selectores resilientes y aserciones completas.',
      status: 'VERIFIED / READY'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">BROWSER STUDIO & RUNNER MULTI-CICLO</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Chromium Sandbox + CDP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizador del ciclo de vida del Browser Runner: Descubrimiento, Replay, Self-Healing y Certificación.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCaseId('tc-019');
            setActiveNav('qa-workspace');
          }}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Abrir en QA Workspace</span>
        </button>
      </div>

      {/* 4-Cycle Horizontal Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {cycles.map(c => {
          const isSelected = activeCycle === c.num;
          return (
            <div
              key={c.num}
              onClick={() => setActiveCycle(c.num)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">PASO 0{c.num}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {c.status}
                </span>
              </div>
              <div className="font-bold text-slate-100">{c.name}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Active Cycle Details Drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase">
              Detalle Operativo del Ciclo #{activeCycle}
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CDP Session Conectada</span>
          </span>
        </div>

        {activeCycle === 1 && (
          <div className="space-y-2 text-slate-300">
            <p>El Crawler de Veris inspeccionó 14 elementos interactivos bajo la política:</p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-cyan-300 text-[11px]">
              crawling_policy: max_depth=5, max_pages=200, allowed_methods=[GET, HEAD], same_origin=true
            </div>
          </div>
        )}

        {activeCycle === 2 && (
          <div className="space-y-2 text-slate-300">
            <p>Fallo provocado: El botón cambió su id de <code>btn-accept-consent</code> a <code>btn-consent-submit</code>.</p>
            <div className="p-3 bg-rose-950/20 rounded border border-rose-800/40 text-rose-300 text-[11px]">
              Error: Locator.click: Timeout 5000ms exceeded waiting for locator('button#btn-accept-consent')
            </div>
          </div>
        )}

        {activeCycle === 3 && (
          <div className="space-y-2 text-slate-300">
            <p>Self-Healing Engine activado automáticamente (Evaluación de 3 candidatos):</p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-emerald-300 text-[11px] space-y-1">
              <div>• Candidato 1: role="button" name="Confirmar y Continuar" · Similitud Semántica: 94% [SELECCIONADO]</div>
              <div>• Candidato 2: button#btn-cancel · Similitud: 18%</div>
              <div>• Candidato 3: a.link-help · Similitud: 12%</div>
            </div>
          </div>
        )}

        {activeCycle === 4 && (
          <div className="space-y-2 text-slate-300">
            <p>Playbook actualizado y verificado con telemetría OTel y evidencia criptográfica adjunta.</p>
            <div className="p-3 bg-slate-950 rounded border border-cyan-800/60 text-cyan-200 text-[11px]">
              playbook_status: VERIFIED · confidence: 0.94 · human_approval: Senior QA (Pending)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
