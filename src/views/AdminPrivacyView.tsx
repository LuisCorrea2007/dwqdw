import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ShieldCheck,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Key,
  Server,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AdminPrivacyView: React.FC = () => {
  const { currentEnv } = useApp();

  const [rawSample, setRawSample] = useState(JSON.stringify({
    patient_name: "María Carmen Delgado",
    cedula: "1719283921",
    telefono: "+593 99 876 5432",
    diagnostico: "Hipertensión arterial esencial",
    password: "SuperSecretPassword123!",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    codigo_cliente: 415,
    estado_convenio: "A"
  }, null, 2));

  const [redactedSample, setRedactedSample] = useState(JSON.stringify({
    patient_name: "[PII_REDACTED]",
    cedula: "hash:7e91a0b3...",
    telefono: "[PII_REDACTED]",
    diagnostico: "[HEALTH_SENSITIVE_REDACTED]",
    password: "[SECRET_REDACTED]",
    token: "Bearer [REDACTED]",
    codigo_cliente: "HMAC:87f1c90a12e (masked)",
    estado_convenio: "A (approved_value)"
  }, null, 2));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI, PRIVACIDAD & GOBERNANZA</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Zero PII Outbound
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Veris aprende estructuras y comportamientos; no necesita copiar historias clínicas para ser inteligente."
          </p>
        </div>

        {/* Canary metric badge from page 35 */}
        <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center space-x-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>veris_external_llm_sensitive_value_total = 0</span>
        </div>
      </div>

      {/* Redaction Pipeline Architecture Box (Matching PDF page 30) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="text-slate-400 uppercase font-semibold text-[11px]">
          Pipeline Determinista de Redacción antes del Límite de Confianza:
        </span>
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 flex items-center justify-between text-xs overflow-x-auto">
          <span>Browser / CDP</span>
          <span className="text-slate-600">→</span>
          <span>Raw Event</span>
          <span className="text-slate-600">→</span>
          <span className="text-amber-400 font-bold">LOCAL REDACTION</span>
          <span className="text-slate-600">→</span>
          <span>Sensitive Detector</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-bold">HMAC Keyed Event</span>
          <span className="text-slate-600">→</span>
          <span>Optional External AI</span>
        </div>
      </div>

      {/* Interactive Redaction Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-rose-400 font-bold text-xs uppercase">Raw Event (Datos en Tránsito Local)</span>
            <span className="text-[10px] text-slate-500">Nunca enviado a LLM</span>
          </div>
          <textarea
            value={rawSample}
            onChange={(e) => setRawSample(e.target.value)}
            className="w-full h-56 bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-xs uppercase">Redacted Event (HMAC Local Keyed)</span>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Sanitizado</span>
          </div>
          <textarea
            value={redactedSample}
            readOnly
            className="w-full h-56 bg-slate-950 p-3 rounded-lg border border-emerald-900/40 text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* LLM Policy: 3 Levels (Matching PDF page 31) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-rose-400 font-bold text-xs uppercase">1. LOCAL ONLY</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nombres de esquemas sensibles, raw evidence, contexto de pacientes, valores de base de datos y credenciales de red. Jamás salen del host local.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-cyan-400 font-bold text-xs uppercase">2. EXTERNAL REDACTED</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Requisitos sin PII, nombres abstractos de entidades empresariales, AST normalizados de SQL y trazas de error sin literales.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-emerald-400 font-bold text-xs uppercase">3. EXTERNAL ALLOWED</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Documentación pública o proyectos clasificados explícitamente como no restringidos por el Security Admin.
          </p>
        </div>
      </div>
    </div>
  );
};
