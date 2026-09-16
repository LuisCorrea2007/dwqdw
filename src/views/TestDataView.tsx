import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Lock,
  Unlock,
  Key,
  Clock,
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Hash,
  UserCheck
} from 'lucide-react';

export const TestDataView: React.FC = () => {
  const {
    testDataProfiles,
    testDataLeases,
    createDataLease,
    releaseDataLease
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(testDataProfiles[0].id);

  const selectedProfile = testDataProfiles.find(p => p.id === selectedProfileId) || testDataProfiles[0];

  const activeLeases = testDataLeases.filter(l => l.status === 'ACTIVE');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">TEST DATA MANAGER & LEASE CONTROL STORE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              Lease Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Garantía de no-colisión para ejecuciones paralelas mediante reserva temporal determinista (TTL) y tokens anonimizados.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Leases activos: <span className="text-cyan-400 font-bold">{activeLeases.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300">
            Aislamiento: <span className="font-bold">Anti-Collision Lock</span>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Perfiles Semánticos de Datos Preconfigurados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testDataProfiles.map((prof) => {
            const isSelected = prof.id === selectedProfile.id;
            return (
              <div
                key={prof.id}
                onClick={() => setSelectedProfileId(prof.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white">{prof.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    {prof.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {prof.description}
                </p>

                <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Candidatos seguros:</span>
                    <span className="text-cyan-300 font-bold">{prof.candidateCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>En uso activo:</span>
                    <span className="text-amber-300 font-bold">{prof.inUseCount}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {prof.identifierColumn}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      createDataLease(prof.id);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 text-[10px] font-mono transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adquirir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Leases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Control Store: Registro Activo de Leases y Locks
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Reaper daemon activo · Expiración automática por TTL
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Lease ID</th>
                <th className="p-3">Entity Key</th>
                <th className="p-3">Token Anonimizado</th>
                <th className="p-3">Run ID</th>
                <th className="p-3">Caso Asociado</th>
                <th className="p-3">Expiración / TTL</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {testDataLeases.map((lease) => (
                <tr key={lease.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-slate-200">{lease.id}</td>
                  <td className="p-3 text-cyan-400 font-semibold">{lease.entityKey}</td>
                  <td className="p-3 text-slate-300 font-mono">{lease.maskedValue}</td>
                  <td className="p-3 text-slate-400">{lease.runId}</td>
                  <td className="p-3 text-slate-300 font-bold">{lease.caseId}</td>
                  <td className="p-3 text-amber-400/90 flex items-center">
                    <Clock className="w-3 h-3 mr-1 shrink-0" />
                    <span>{lease.expiresAt}</span>
                  </td>
                  <td className="p-3">
                    {lease.status === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
                        ACTIVO (LOCK)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                        LIBERADO
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {lease.status === 'ACTIVE' && (
                      <button
                        onClick={() => releaseDataLease(lease.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 text-[10px] transition-colors border border-slate-700"
                      >
                        Liberar Lock
                      </button>
                    )}
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
