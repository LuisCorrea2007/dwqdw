import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Play,
  Terminal,
  FileCheck,
  Stethoscope,
  Network,
  Globe,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  X
} from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveNav,
    runTestCase,
    setSelectedCaseId,
    testCases
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const defaultActions = [
    {
      id: 'run-cu-019',
      category: 'Ejecución Inmediata',
      title: 'Ejecutar caso CU-019 (Consentimiento Multicanal)',
      shortcut: '⌘↵',
      icon: Play,
      action: () => {
        setSelectedCaseId('tc-019');
        runTestCase('tc-019');
        setActiveNav('qa-workspace');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'open-cu-019',
      category: 'QA Workspace',
      title: 'Abrir CU-019 en Workspace interactivo',
      icon: ArrowRight,
      action: () => {
        setSelectedCaseId('tc-019');
        setActiveNav('qa-workspace');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'sql-paciente',
      category: 'SQL Autopilot',
      title: 'SQL: Buscar convenios activos de paciente 415',
      icon: Terminal,
      action: () => {
        setActiveNav('studio-sql');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'open-doctor',
      category: 'System Doctor',
      title: 'Ejecutar diagnóstico completo System Doctor v3',
      icon: Stethoscope,
      action: () => {
        setActiveNav('admin-doctor');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'learn-consentimiento',
      category: 'Learned Pages',
      title: 'Aprender página de consentimiento (crawling allowlisted)',
      icon: Globe,
      action: () => {
        setActiveNav('intel-learned-pages');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'req-view',
      category: 'Requirements Intelligence',
      title: 'Ver requisitos de Consentimiento_LOPDP_v7.pdf',
      icon: FileCheck,
      action: () => {
        setActiveNav('qa-requirements');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'data-leases',
      category: 'Test Data',
      title: 'Ver leases activos de datos de prueba QA',
      icon: Database,
      action: () => {
        setActiveNav('qa-test-data');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'knowledge-graph',
      category: 'Knowledge Plane',
      title: 'Explorar Knowledge Graph y relaciones inferidas',
      icon: Network,
      action: () => {
        setActiveNav('intel-knowledge-graph');
        setIsCommandPaletteOpen(false);
      }
    }
  ];

  const filtered = defaultActions.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-slate-800 py-3 bg-slate-950/60">
          <Search className="w-4 h-4 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué quieres hacer? (ej. ejecutar CU-019, sql paciente convenio, doctor...)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-950/30 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="text-slate-400 font-mono text-[10px]">Sugerencias:</span>
          {['ejecutar CU-019', 'sql paciente convenio', 'doctor', 'conexiones qa', 'test data'].map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-mono border border-slate-700/60 whitespace-nowrap"
            >
              &gt; {s}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No se encontraron acciones o entidades para "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-600/20 text-cyan-200 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`p-1.5 rounded ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-slate-100">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.category}</div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ para navegar</span>
            <span>↵ para ejecutar</span>
          </div>
          <span className="text-cyan-400/80 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" /> Buscador universal de acciones & conocimiento
          </span>
        </div>
      </div>
    </div>
  );
};
