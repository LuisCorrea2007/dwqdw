import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Shield,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  GitFork,
  ArrowDown
} from 'lucide-react';

export const LearnedPagesView: React.FC = () => {
  const { learnedPages, currentEnv } = useApp();
  const [selectedPageId, setSelectedPageId] = useState<string>(learnedPages[0].id);

  const selectedPage = learnedPages.find(p => p.id === selectedPageId) || learnedPages[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">LEARNED PAGES & ACTION GRAPH</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Crawling Discovery
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Una página es una entidad con environment_id, allowed origin, authentication profile, crawling policy y grafo de acciones.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
          <Shield className="w-3.5 h-3.5" />
          <span>SSRF Host & Port Gate: ENFORCED</span>
        </div>
      </div>

      {/* Pages List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pages List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[560px]">
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase font-semibold">
            PÁGINAS APRENDIDAS ({learnedPages.length})
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {learnedPages.map(page => {
              const isSelected = page.id === selectedPage.id;
              return (
                <div
                  key={page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{page.name}</span>
                    <span className="text-[10px] text-cyan-400">{page.version}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{page.url}</div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1">
                    <span>{page.semanticControls.length} controles</span>
                    <span>·</span>
                    <span>{page.environment}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Page Details & Action Graph (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 font-mono text-xs">
          {/* Top Info */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">ENTIDAD DE APRENDIZAJE</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{selectedPage.name}</h2>
              <div className="text-slate-400 text-xs mt-1">{selectedPage.url}</div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <div>Allowed Origin: <span className="text-cyan-300">{selectedPage.allowedOrigin}</span></div>
              <div>Último crawl: <span className="text-slate-300">{selectedPage.lastLearned}</span></div>
            </div>
          </div>

          {/* Crawling Policy Limits (Page 19) */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 uppercase font-semibold text-[11px]">Límites Explícitos de Crawling:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAX DEPTH</span>
                <span className="text-white font-bold">{selectedPage.crawlingPolicy.maxDepth} niveles</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAX PAGES</span>
                <span className="text-white font-bold">{selectedPage.crawlingPolicy.maxPages} URLs</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAX DURATION</span>
                <span className="text-white font-bold">{selectedPage.crawlingPolicy.maxDurationMin} min</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">METHODS</span>
                <span className="text-cyan-400 font-bold">{selectedPage.crawlingPolicy.allowedMethods.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Action Graph Representation (Matching PDF page 5) */}
          <div className="space-y-2">
            <span className="text-slate-400 uppercase font-semibold text-[11px]">Grafo Semántico de Acciones Descubiertas:</span>
            
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <div className="text-cyan-300 font-bold flex items-center space-x-1.5">
                <span>Login</span>
                <span className="text-slate-600">→</span>
                <span>Dashboard</span>
                <span className="text-slate-600">→</span>
                <span className="text-white">Consentimiento</span>
              </div>

              <div className="pl-4 border-l-2 border-slate-800 space-y-2 text-[11px]">
                {selectedPage.semanticControls.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-200 font-semibold">{c.accessibleName || c.concept}</span>
                      <span className="text-slate-500 text-[10px]">({c.role})</span>
                      {c.testid && <span className="text-cyan-400 text-[10px]">[{c.testid}]</span>}
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      c.risk === 'state_change'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.risk === 'state_change' ? '[STATE CHANGING]' : '[NON-DESTRUCTIVE]'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
