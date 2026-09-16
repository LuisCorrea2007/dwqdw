import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Network,
  CheckCircle2,
  HelpCircle,
  Shield,
  Layers,
  Search,
  Database,
  Link,
  Info,
  ChevronRight,
  Code2,
  X
} from 'lucide-react';
import { KnowledgeEntity } from '../types';

export const KnowledgeGraphView: React.FC = () => {
  const { entities, selectedEntityId, setSelectedEntityId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [auditModalData, setAuditModalData] = useState<{
    relationship: KnowledgeEntity['relationships'][0];
    fromEntity: string;
  } | null>(null);

  const selectedEntity = entities.find(e => e.id === selectedEntityId) || entities[0];

  const filteredEntities = entities.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">KNOWLEDGE GRAPH & SEMANTIC MODEL</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Entity Plane
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            La unidad principal no es la "tabla" sino el concepto empresarial verificado con procedencia y evidencia auditable.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Último escaneo catálogos: <span className="text-cyan-400 font-semibold">hace 4 min</span>
        </div>
      </div>

      {/* Main Split: Concepts List (Left) + Selected Concept Details (Right - matching page 40) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Concept Explorer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[560px]">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar concepto o alias..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredEntities.map(ent => {
              const isSelected = ent.id === selectedEntity.id;
              return (
                <button
                  key={ent.id}
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/30 text-cyan-200 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                    <span className="font-semibold text-white font-mono text-sm">{ent.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {ent.verifiedPatternsCount} patrones
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Concept Card matching exact PDF page 40 layout (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {/* Concept Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">CONCEPTO EMPRESARIAL</span>
              <h2 className="text-2xl font-bold font-mono text-white tracking-tight mt-0.5">{selectedEntity.name.toUpperCase()}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">PATRONES VERIFICADOS</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{selectedEntity.verifiedPatternsCount}</span>
            </div>
          </div>

          {/* Aliases Section */}
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">ALIASES CONOCIDOS:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedEntity.aliases.map(al => (
                <span key={al} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                  {al}
                </span>
              ))}
            </div>
          </div>

          {/* Validated Identifiers Section */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">IDENTIFICADORES EN BASE DE DATOS:</span>
            <div className="space-y-1.5">
              {selectedEntity.identifiers.map((ident, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-200 font-semibold">{ident.relation}.{ident.column}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-slate-500">procedencia: [{ident.provenance.join(', ')}]</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60">
                      confidence {(ident.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships & Inferences Section */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">RELACIONES Y GRAFO DE JOINS:</span>
            <div className="space-y-2">
              {selectedEntity.relationships.map((rel, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold">├─ {rel.to}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                        rel.kind === 'foreign_key'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}>
                        {rel.kind === 'foreign_key' ? 'FK DECLARADA' : 'INFERRED'}
                      </span>
                      <span className="text-slate-300 font-semibold">{(rel.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      via: {rel.via.join(' = ')}
                    </div>
                  </div>

                  {/* Audit Button "¿Por qué lo sabemos?" (From Page 40) */}
                  <button
                    onClick={() => setAuditModalData({ relationship: rel, fromEntity: selectedEntity.name })}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] font-medium transition-colors border border-slate-700"
                  >
                    ¿Por qué lo sabemos? →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal "¿Por qué lo sabemos?" (Matching PDF Page 40) */}
      {auditModalData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  ¿Por qué lo sabemos? · Evidencia Auditable
                </h3>
              </div>
              <button
                onClick={() => setAuditModalData(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-300">
              Relación entre <span className="text-cyan-300 font-bold">{auditModalData.fromEntity}</span> y{' '}
              <span className="text-cyan-300 font-bold">{auditModalData.relationship.to}</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-emerald-400">✓ nombres compatibles</div>
              <div className="text-emerald-400">✓ datatype {auditModalData.relationship.auditDetails.dataTypesMatch}</div>
              <div className="text-emerald-400">✓ índice en ambos campos (B-tree)</div>
              <div className="text-emerald-400">
                ✓ {auditModalData.relationship.auditDetails.sampledRows} valores comparados
              </div>
              <div className="text-emerald-400">
                ✓ {auditModalData.relationship.auditDetails.matchingCount} coincidencias exactas
              </div>
              {auditModalData.relationship.auditDetails.fkDeclared ? (
                <div className="text-blue-400">✓ FK declarada en catálogo pg_constraint</div>
              ) : (
                <div className="text-amber-400">✗ no existe FK declarada en catálogo</div>
              )}

              <div className="pt-3 border-t border-slate-800 mt-2">
                <div className="text-slate-400 text-[11px]">Classification:</div>
                <div className="text-cyan-300 font-bold text-xs mt-0.5">
                  {auditModalData.relationship.kind === 'foreign_key'
                    ? 'DECLARED_FOREIGN_KEY (Confianza: 100%)'
                    : 'INFERRED / DATA VERIFIED (Confianza: 91%)'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Regla de gobernanza: inferred_verified ≠ declared_foreign_key. La procedencia queda registrada para auditoría.
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setAuditModalData(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
