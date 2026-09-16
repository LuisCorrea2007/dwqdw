import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Play,
  PlayCircle,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Globe,
  Database,
  Smartphone,
  Webhook
} from 'lucide-react';
import { TestCase } from '../types';

export const TestCasesView: React.FC = () => {
  const { testCases, setSelectedCaseId, setActiveNav, runTestCase } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCases = testCases.filter(tc => {
    const matchesSearch = tc.code.toLowerCase().includes(search.toLowerCase()) ||
                          tc.name.toLowerCase().includes(search.toLowerCase()) ||
                          tc.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'PASS':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">PASS</span>;
      case 'FAIL':
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">FAIL</span>;
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold animate-pulse">RUNNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">READY</span>;
    }
  };

  const getChannelIcon = (channel: 'Web' | 'Mobile' | 'API' | 'DB') => {
    switch (channel) {
      case 'Web': return <Globe className="w-3.5 h-3.5 text-cyan-400" title="Web" />;
      case 'Mobile': return <Smartphone className="w-3.5 h-3.5 text-indigo-400" title="Mobile" />;
      case 'API': return <Webhook className="w-3.5 h-3.5 text-emerald-400" title="API" />;
      case 'DB': return <Database className="w-3.5 h-3.5 text-amber-400" title="Database" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">TEST CASES REPOSITORY & MATRIX</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              QA Plane
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Casos de prueba deterministas con validación cruzada multicanal (Web, API y base de datos).
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Total Casos: <span className="text-white font-bold">{testCases.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300">
            Aprobados: <span className="font-bold">{testCases.filter(t => t.status === 'PASS').length}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código CU-xxx, nombre o requisito..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
            <option value="RUNNING">RUNNING</option>
            <option value="READY">READY</option>
          </select>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Nombre del Caso de Prueba</th>
                <th className="p-3.5">Canales</th>
                <th className="p-3.5">Requisitos Vinculados</th>
                <th className="p-3.5">Pasos</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCases.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-cyan-300 font-mono text-sm">{tc.code}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white text-xs">{tc.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tc.description}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-1.5">
                      {tc.channels.map(ch => (
                        <span key={ch} title={ch}>{getChannelIcon(ch)}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {tc.coverageRequirements.map(req => (
                        <span key={req} className="px-1.5 py-0.2 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                          {req}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">{tc.steps.length} pasos</td>
                  <td className="p-3.5">{getStatusBadge(tc.status)}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCaseId(tc.id);
                          setActiveNav('qa-workspace');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-200 text-slate-300 text-[11px] font-mono transition-colors border border-slate-700 flex items-center space-x-1"
                      >
                        <PlayCircle className="w-3 h-3 text-cyan-400" />
                        <span>Abrir Workspace</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
