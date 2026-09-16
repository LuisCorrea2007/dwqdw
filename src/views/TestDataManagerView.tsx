import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Search,
  Key,
  Shield,
  Clock,
  CheckCircle2,
  RefreshCw,
  Plus,
  Lock,
  EyeOff,
  UserCheck
} from 'lucide-react';

export const TestDataManagerView: React.FC = () => {
  const {
    testDataProfiles,
    testDataLeases,
    createDataLease,
    releaseDataLease,
    currentEnv
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profiles' | 'leases' | 'resolver'>('profiles');
  const [naturalQuery, setNaturalQuery] = useState('paciente activo, convenio vigente y sin consentimiento');
  const [resolvedResult, setResolvedResult] = useState<{
    candidateId: string;
    maskedKey: string;
    sql: string;
    leaseKey: string;
  } | null>(null);

  const handleResolve = () => {
    setResolvedResult({
      candidateId: '415',
      maskedKey: 'QA-PATIENT-5A92 (codigo_cliente: •••415)',
      sql: `SELECT a.codigo_cliente \nFROM comercial.com_afiliados_x_cliente a\nJOIN comercial.com_convenios_clientes c ON c.codigo_convenio = a.codigo_convenio\nLEFT JOIN clinica.consentimientos cs ON cs.id_paciente = a.codigo_cliente AND cs.estado = 'VIGENTE'\nWHERE a.es_activo = 'S' \n  AND c.estado = 'A'\n  AND cs.id_consentimiento IS NULL\nLIMIT 1;`,
      leaseKey: `test_data_lease: entity_key = patient:415, run_id = RUN-1882, expires_at = +15m`
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">TEST DATA MANAGER</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Ambiente {currentEnv}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Búsqueda estructurada read-only, leasing local en Control Store sin bloqueos en base de negocio y enmascaramiento estricto de PII.
          </p>
        </div>

        {/* Top Actions matching page 42 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('resolver')}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Resolver nuevo</span>
          </button>
          <button
            onClick={() => alert('Todos los perfiles de datos revalidados contra catálogo PostgreSQL.')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-medium border border-slate-700"
          >
            Validar todos
          </button>
          <button
            onClick={() => setActiveTab('leases')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-medium border border-slate-700"
          >
            Ver leases ({testDataLeases.filter(l => l.status === 'ACTIVE').length})
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'profiles' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Perfiles de Prueba ({testDataProfiles.length})
        </button>
        <button
          onClick={() => setActiveTab('leases')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'leases' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Leases Activos ({testDataLeases.length})
        </button>
        <button
          onClick={() => setActiveTab('resolver')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'resolver' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Precondition Resolver
        </button>
      </div>

      {/* Tab 1: Profiles Table matching PDF page 42 */}
      {activeTab === 'profiles' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="p-3.5">Perfil</th>
                <th className="p-3.5 text-right">Candidatos</th>
                <th className="p-3.5 text-right">En uso</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5">Identificador Máscara</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {testDataProfiles.map(p => (
                <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-200">
                    <div>{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{p.description}</div>
                  </td>
                  <td className="p-3.5 text-right text-cyan-300 font-bold">{p.candidateCount}</td>
                  <td className="p-3.5 text-right text-amber-300">{p.inUseCount}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/60">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    <span className="text-slate-300 font-semibold">{p.sampleMaskedKey}</span>
                    <span className="text-slate-500 ml-2">({p.identifierColumn})</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => createDataLease(p.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 text-[11px]"
                    >
                      Tomar Lease
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Leases Table */}
      {activeTab === 'leases' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px]">
            El lease se guarda en el Control Store local/PostgreSQL con TTL, evitando locks o transacciones abiertas en la base de negocio.
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="p-3.5">Lease ID</th>
                <th className="p-3.5">Entity Key</th>
                <th className="p-3.5">Máscara Segura</th>
                <th className="p-3.5">Run ID</th>
                <th className="p-3.5">Adquirido / TTL</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Liberar</th>
              </tr>
            </thead>
            <tbody>
              {testDataLeases.map(l => (
                <tr key={l.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 text-slate-400 font-semibold">{l.id}</td>
                  <td className="p-3.5 text-cyan-300 font-bold">{l.entityKey}</td>
                  <td className="p-3.5 text-slate-200">{l.maskedValue}</td>
                  <td className="p-3.5 text-indigo-300">{l.runId} ({l.caseId})</td>
                  <td className="p-3.5 text-slate-400 text-[11px]">{l.acquiredAt} ({l.expiresAt})</td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {l.status === 'ACTIVE' && (
                      <button
                        onClick={() => releaseDataLease(l.id)}
                        className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded text-[11px] border border-slate-700"
                      >
                        Liberar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Precondition Resolver Interactive Playground (Pages 8-9) */}
      {activeTab === 'resolver' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 font-mono text-xs">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase">Precondition Resolver Autónomo</h2>
            <p className="text-slate-400 text-[11px]">
              Traduce intenciones naturales en consultas de candidatos sin mutación de estado en PROD.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold">Intención de Precondición del Caso:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                className="flex-1 bg-slate-950 p-2.5 rounded-lg border border-slate-700 text-cyan-200 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleResolve}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
              >
                Resolver Candidato
              </button>
            </div>
          </div>

          {resolvedResult && (
            <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>Candidato Encontrado & Reservado:</span>
                <span className="text-emerald-400">✓ Validado Read-Only</span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="text-slate-500">Mascara asignada: </span>
                <span className="text-white font-bold">{resolvedResult.maskedKey}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block mb-1">SQL Generado & Validado en AST:</span>
                <pre className="p-2.5 bg-slate-900 rounded text-[10px] text-cyan-200 overflow-x-auto">
                  {resolvedResult.sql}
                </pre>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block mb-1">Entrada de Lease en Control Store:</span>
                <pre className="p-2 bg-slate-900 rounded text-[10px] text-indigo-300">
                  {resolvedResult.leaseKey}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
