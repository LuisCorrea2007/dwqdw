import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ApiStudioView: React.FC = () => {
  const { currentEnv } = useApp();
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState('https://qa-api.veris.com.ec/v1/consentimientos/validar');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    codigo_cliente: 415,
    codigo_convenio: 102,
    tipo_procedimiento: "ODONTOLOGIA_GENERAL"
  }, null, 2));

  const [response, setResponse] = useState<any>({
    status: 200,
    timeMs: 46,
    body: {
      valido: true,
      requiere_consentimiento: false,
      convenio_activo: true,
      tipo_cobertura: "TOTAL_SIN_COPAGO",
      timestamp: "2026-09-16T10:32:00.912Z"
    }
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">API STUDIO & CONTRATOS</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              HTTP / REST / gRPC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pruebas de endpoints del ecosistema Veris con aserciones de esquema JSON y correlación de trazas OTel.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span>Ambiente: </span>
          <span className="text-cyan-300 font-bold">{currentEnv}</span>
        </div>
      </div>

      {/* Request bar */}
      <div className="flex space-x-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-cyan-400 font-bold px-3 py-2 rounded-lg focus:outline-none"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg focus:outline-none"
        />
        <button
          onClick={() => alert('Petición HTTP enviada exitosamente.')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center space-x-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </div>

      {/* Split: Request & Response */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-slate-400 font-semibold uppercase text-[11px]">Request Payload (JSON):</div>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full h-64 bg-slate-950 p-3 rounded-lg border border-slate-800 text-cyan-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Response:</span>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-emerald-400 font-bold">200 OK</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-300">{response.timeMs} ms</span>
            </div>
          </div>
          <pre className="w-full h-64 bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-300 font-mono text-xs overflow-auto leading-relaxed">
{JSON.stringify(response.body, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
