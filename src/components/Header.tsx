import React from 'react';
import { useApp } from '../context/AppContext';
import { EnvironmentType, UserRole } from '../types';
import {
  Shield,
  Activity,
  Search,
  Server,
  AlertCircle,
  Lock,
  ChevronDown,
  Sparkles,
  Zap,
  Terminal
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentEnv,
    setCurrentEnv,
    currentUserRole,
    setCurrentUserRole,
    systemStatus,
    setIsCommandPaletteOpen,
    setActiveNav
  } = useApp();

  const envs: EnvironmentType[] = ['DEV', 'QA', 'UAT', 'PREPROD', 'PROD'];
  const roles: UserRole[] = [
    'Senior QA',
    'QA Engineer',
    'Data Steward',
    'Environment Admin',
    'Security Admin',
    'Platform Admin',
    'Viewer'
  ];

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Platform Identity */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveNav('command-center')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-wide text-white font-mono">VERIS QA AI</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-cyan-400 rounded font-mono border border-slate-700">v3.0</span>
            </div>
            <div className="text-[10px] text-slate-400">Autonomous QA Engineering Platform</div>
          </div>
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1"></div>

        {/* Environment Selector with Policies */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {envs.map(env => {
            const isActive = currentEnv === env;
            const isProd = env === 'PROD';
            return (
              <button
                key={env}
                onClick={() => setCurrentEnv(env)}
                className={`px-2 py-1 text-xs font-mono font-medium rounded transition-all flex items-center space-x-1 ${
                  isActive
                    ? isProd
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={isProd ? 'PROD: Read-only estricto, 0 mutaciones' : `Ambiente ${env}`}
              >
                {isProd && <Lock className="w-2.5 h-2.5 mr-0.5 text-rose-400" />}
                <span>{env}</span>
              </button>
            );
          })}
        </div>

        {currentEnv === 'PROD' && (
          <span className="hidden lg:inline-flex items-center text-[10px] font-mono text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/60">
            <Lock className="w-2.5 h-2.5 mr-1" /> READ ONLY POLICY ACTIVE
          </span>
        )}
      </div>

      {/* Global Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-950/90 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-400 transition-all group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-slate-400 font-mono text-xs">Buscar CU, SQL, requisitos, doctor...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded">
            ⌘K / Ctrl+K
          </kbd>
        </button>
      </div>

      {/* System Status, Workers, Role */}
      <div className="flex items-center space-x-3">
        {/* Workers online */}
        <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>8/8 workers</span>
        </div>

        {/* System Doctor status pill */}
        <button
          onClick={() => setActiveNav('admin-doctor')}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono transition-colors"
          title="Ver diagnóstico System Doctor v3"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-300 font-semibold">{systemStatus}</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">Doctor v3</span>
        </button>

        {/* User Role Selector */}
        <div className="relative flex items-center">
          <select
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
            className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded px-2.5 py-1 appearance-none pr-6 font-medium cursor-pointer focus:outline-none focus:border-cyan-500"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
