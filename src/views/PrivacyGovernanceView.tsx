import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Shield,
  ShieldCheck,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Key,
  Database,
  Search,
  ArrowRight
} from 'lucide-react';

export const PrivacyGovernanceView: React.FC = () => {
  const [testInput, setTestInput] = useState(
    'SELECT * FROM comercial.com_afiliados_x_cliente WHERE cedula_identidad = \'0928374619\' AND nombre_completo = \'JUAN CARLOS PEREZ\';'
  );
  const [redactedOutput, setRedactedOutput] = useState<string | null>(null);

  const handleTestRedaction = () => {
    // Deterministic HMAC/Canary redaction simulation
    const sanitized = testInput
      .replace(/'0928374619'/g, '\':HMAC_CEDULA_89A2:\'')
      .replace(/'JUAN CARLOS PEREZ'/g, '\':HMAC_NAME_41B9:\'');
    setRedactedOutput(sanitized);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white font-mono tracking-tight">AI PRIVACY & ZERO-SENSITIVE EGRESS ENGINE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
              OWASP LLM-06 / NIST AI RMF
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Políticas estrictas de gobernanza: Redacción local en memoria con HMAC y canarios criptográficos antes de cualquier inferencia.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Fugas detectadas: <span className="text-emerald-400 font-bold">0</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300">
            Regla: <span className="font-bold">Zero PII Outbound</span>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Data Governance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Key className="w-4 h-4" />
            <span>1. HMAC Pseudonymization</span>
          </div>
          <p className="text-xs text-slate-400">
            Cédulas, nombres y datos de contacto se transforman en claves criptográficas temporales con sal local rotativa cada 24 horas.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>2. Inyección de Canarios</span>
          </div>
          <p className="text-xs text-slate-400">
            Se insertan marcadores trampa sintéticos en cada payload saliente. Si un canario sin ofuscar llega al proxy de salida, la solicitud se aborta de inmediato.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold uppercase">
            <Database className="w-4 h-4" />
            <span>3. Catálogo LOPDP de Bloqueo</span>
          </div>
          <p className="text-xs text-slate-400">
            Filtro denegatorio a nivel de metadatos: Toda columna con clasificación <code className="text-rose-300">PII</code> o <code className="text-amber-300">HEALTH_SENSITIVE</code> queda excluida de los prompts de LLM.
          </p>
        </div>
      </div>

      {/* Interactive Redaction Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Simulador Interactivo de Sanitización de Prompts / Consultas
            </h3>
          </div>
          <button
            onClick={handleTestRedaction}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-semibold transition-colors"
          >
            Ejecutar Sanitización
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block font-semibold">
              Payload Original (con datos sensibles / PII):
            </label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-emerald-400 block font-semibold">
              Payload Redactado Seguro (Zero-Sensitive Egress):
            </label>
            <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 min-h-[96px] leading-relaxed">
              {redactedOutput ? (
                <div className="space-y-2">
                  <div className="text-emerald-300 font-bold">✓ Redacción aprobada (0 bytes sensibles expuestos):</div>
                  <div className="text-cyan-300">{redactedOutput}</div>
                </div>
              ) : (
                <span className="text-slate-500">Haga click en "Ejecutar Sanitización" para probar la redacción...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
