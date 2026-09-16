import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Layers,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';

export const RequirementsIntelligenceView: React.FC = () => {
  const { requirements, setSelectedCaseId, setActiveNav } = useApp();
  const [selectedReqId, setSelectedReqId] = useState<string>('req-017');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedReq = requirements.find(r => r.id === selectedReqId) || requirements[0];

  const filteredReqs = requirements.filter(r =>
    r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">REQUIREMENTS INTELLIGENCE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Document Grounding
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Extracción determinista y trazabilidad de requisitos legales y funcionales hacia casos de prueba automatizados.
          </p>
        </div>

        {/* Source Document Badge */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono flex items-center space-x-3">
          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-slate-200 font-semibold text-[11px]">Consentimiento_LOPDP_v7.pdf</div>
            <div className="text-slate-500 text-[10px]">28 requisitos detectados · 25 cubiertos · 1 parcial · 2 sin cobertura</div>
          </div>
        </div>
      </div>

      {/* Main Split: Requirements List (Left) + Detailed Requirement View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requirements List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por código o texto..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredReqs.map(req => {
              const isSelected = req.id === selectedReq.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-200 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">{req.code}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      req.status === 'COVERED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : req.status === 'PARTIAL'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : req.status === 'AMBIGUOUS'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 line-clamp-1">{req.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Pág. {req.sourcePage} · {req.sourceSection}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Requirement Details matching page 41-42 (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          {/* Header of selected requirement */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {selectedReq.code}
                </span>
                <h2 className="text-base font-semibold text-white">{selectedReq.title}</h2>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Fuente: <span className="text-slate-300">{selectedReq.sourceDoc}</span> · Página {selectedReq.sourcePage} · {selectedReq.sourceSection}
              </div>
            </div>

            {selectedReq.needsClarification ? (
              <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-mono font-semibold">
                NEEDS HUMAN CLARIFICATION
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-semibold">
                GROUNDED ✓
              </span>
            )}
          </div>

          {/* Legal / Functional Specification Quote */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Texto del Requisito en Documento Legal:
            </label>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed italic border-l-2 border-l-cyan-500">
              "{selectedReq.text}"
            </div>
          </div>

          {/* Ambiguity / Human Clarification Box (Matching PDF rule: No fabricar criterio de aceptación) */}
          {selectedReq.needsClarification && (
            <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/60 space-y-1 text-xs">
              <div className="flex items-center space-x-1.5 text-purple-300 font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Requisito Ambiguo (Política Anti-Alucinación)</span>
              </div>
              <p className="text-purple-200/90 text-[11px] leading-relaxed">
                {selectedReq.clarificationNotes}
              </p>
            </div>
          )}

          {/* Test Coverage & Gap Analysis (Matching page 41-42) */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Trazabilidad y Cobertura (Casos QA):
            </label>

            {selectedReq.coverageCases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedReq.coverageCases.map(c => (
                  <div
                    key={c.caseCode}
                    onClick={() => {
                      setSelectedCaseId(c.caseCode === 'CU-019' ? 'tc-019' : 'tc-021');
                      setActiveNav('qa-workspace');
                    }}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white">{c.caseCode}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        c.outcome === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {c.outcome}
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-mono flex items-center">
                      Workspace <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-500 font-mono">
                No hay casos automatizados vinculados. Requisito pendiente de generación por Playbook Compiler.
              </div>
            )}

            {/* Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400">Canales Afectados: </span>
              <div className="inline-flex items-center space-x-2 ml-2">
                {selectedReq.channels.map(ch => (
                  <span key={ch} className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {ch === 'Web' && <Globe className="w-2.5 h-2.5 mr-1 text-cyan-400" />}
                    {ch === 'Mobile' && <Smartphone className="w-2.5 h-2.5 mr-1 text-indigo-400" />}
                    {ch === 'DB' && <Database className="w-2.5 h-2.5 mr-1 text-amber-400" />}
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap Analysis Box */}
            {selectedReq.gapAnalysis && (
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs font-mono text-amber-200">
                <span className="font-bold text-amber-300">Gap Identificado: </span>
                <span>{selectedReq.gapAnalysis}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
