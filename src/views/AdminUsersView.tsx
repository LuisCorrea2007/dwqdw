import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Shield, Check, Lock } from 'lucide-react';
import { UserRole } from '../types';

export const AdminUsersView: React.FC = () => {
  const { currentUserRole, setCurrentUserRole } = useApp();

  const roleDefinitions: {
    role: UserRole;
    access: string;
    permissions: string[];
  }[] = [
    {
      role: 'Viewer',
      access: 'Dashboards, ejecuciones redactadas',
      permissions: ['Ver Command Center', 'Ver ejecuciones sanitizadas', 'Ver métricas OTel']
    },
    {
      role: 'QA Engineer',
      access: 'Casos, runs, QA pages, SQL read-only',
      permissions: ['Ejecutar casos de prueba', 'Avanzar steps interactivos', 'Usar SQL Studio read-only', 'Crear leases de test data']
    },
    {
      role: 'Senior QA',
      access: 'Aprobar playbooks y repairs',
      permissions: ['Aprobar/rechazar Self-Healing', 'Promover playbooks a TRUSTED', 'Crear suites de regresión', 'Editar precondiciones']
    },
    {
      role: 'Data Steward',
      access: 'Clasificación de columnas y test-data profiles',
      permissions: ['Editar clasificación de sensibilidad (PII, HEALTH)', 'Aprobar muestreo de columnas', 'Aclarar requisitos ambiguos']
    },
    {
      role: 'Environment Admin',
      access: 'Conexiones, URLs, policies',
      permissions: ['Configurar conexiones PostgreSQL', 'Gestionar SSRF allowlists', 'Definir límites de crawling']
    },
    {
      role: 'Security Admin',
      access: 'Secrets, RBAC, audit, retention',
      permissions: ['Rotar claves AES de encriptación', 'Configurar LLM Outbound Policy', 'Auditar accesos y PII canaries']
    },
    {
      role: 'Platform Admin',
      access: 'Workers, settings, deployment',
      permissions: ['Escalar workers de browser y BD', 'Ejecutar migraciones', 'Gestionar cola Redis/Celery']
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">ROLES & CONTROL DE ACCESO (RBAC)</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Mínimo Privilegio NIST
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Matriz de gobierno y segregación de funciones entre ingeniería, seguridad y custodia de datos de salud.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Rol en sesión: <span className="text-cyan-300 font-bold">{currentUserRole}</span>
        </div>
      </div>

      {/* Roles Matrix Table (Matching PDF Page 32) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
              <th className="p-3.5">Rol</th>
              <th className="p-3.5">Nivel de Acceso Principal</th>
              <th className="p-3.5">Permisos Operativos Específicos</th>
              <th className="p-3.5 text-right">Asignar Sesión</th>
            </tr>
          </thead>
          <tbody>
            {roleDefinitions.map(rd => {
              const isCurrent = rd.role === currentUserRole;
              return (
                <tr key={rd.role} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-white text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                      <span>{rd.role}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">{rd.access}</td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {rd.permissions.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    {isCurrent ? (
                      <span className="text-cyan-400 font-bold text-[11px]">ACTIVO ✓</span>
                    ) : (
                      <button
                        onClick={() => setCurrentUserRole(rd.role)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700 transition-colors"
                      >
                        Conmutar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
