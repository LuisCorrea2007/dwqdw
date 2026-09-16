import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationItem } from '../types';
import {
  LayoutDashboard,
  PlayCircle,
  FileCheck,
  Layers,
  CheckSquare,
  History,
  Database,
  Network,
  Cpu,
  Globe,
  Code2,
  BookOpen,
  Terminal,
  Webhook,
  Monitor,
  Radio,
  FileText,
  HeartPulse,
  ShieldAlert,
  Users,
  ScrollText,
  Lock,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    id: NavigationItem;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    pulse?: boolean;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, testCases, requirements, testDataProfiles } = useApp();

  const isRunning = testCases.some(t => t.status === 'RUNNING');
  const uncoveredReqs = requirements.filter(r => r.status === 'UNCOVERED' || r.status === 'PARTIAL').length;
  const readyProfiles = testDataProfiles.filter(p => p.status === 'READY').length;

  const sections: NavSection[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'command-center', label: 'Command Center', icon: LayoutDashboard }
      ]
    },
    {
      title: 'QA',
      items: [
        { id: 'qa-workspace', label: 'Workspace', icon: PlayCircle, pulse: isRunning },
        { id: 'qa-requirements', label: 'Requirements', icon: FileCheck, badge: uncoveredReqs > 0 ? `${uncoveredReqs}` : undefined },
        { id: 'qa-test-cases', label: 'Test Cases', icon: CheckSquare, badge: testCases.length },
        { id: 'qa-suites', label: 'Suites', icon: Layers },
        { id: 'qa-executions', label: 'Executions', icon: History },
        { id: 'qa-test-data', label: 'Test Data', icon: Database, badge: `${readyProfiles} ready` }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'intel-knowledge-graph', label: 'Knowledge Graph', icon: Network },
        { id: 'intel-db-intelligence', label: 'Database Intelligence', icon: Cpu },
        { id: 'intel-learned-pages', label: 'Learned Pages', icon: Globe },
        { id: 'intel-sql-patterns', label: 'SQL Patterns', icon: Code2 },
        { id: 'intel-playbooks', label: 'Playbooks', icon: BookOpen }
      ]
    },
    {
      title: 'STUDIO',
      items: [
        { id: 'studio-sql', label: 'SQL Studio', icon: Terminal },
        { id: 'studio-api', label: 'API Studio', icon: Webhook },
        { id: 'studio-browser', label: 'Browser Studio', icon: Monitor }
      ]
    },
    {
      title: 'ENVIRONMENTS',
      items: [
        { id: 'env-connections', label: 'Connections', icon: Radio },
        { id: 'env-pages', label: 'Pages', icon: FileText },
        { id: 'env-health', label: 'Health', icon: HeartPulse },
        { id: 'env-policies', label: 'Policies', icon: ShieldAlert }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'admin-users', label: 'Users & Roles', icon: Users },
        { id: 'admin-audit', label: 'Audit', icon: ScrollText },
        { id: 'admin-privacy', label: 'AI & Privacy', icon: Lock },
        { id: 'admin-doctor', label: 'System Doctor', icon: Stethoscope }
      ]
    }
  ];

  return (
    <aside className="w-60 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors font-medium group ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {item.pulse && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                      )}
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info: OpenTelemetry + PostgreSQL status */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/60 text-[10px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Telemetry OTel:</span>
          <span className="text-emerald-400 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 inline-block"></span> CONNECTED
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Deterministic Compiler:</span>
          <span className="text-cyan-400">ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};
