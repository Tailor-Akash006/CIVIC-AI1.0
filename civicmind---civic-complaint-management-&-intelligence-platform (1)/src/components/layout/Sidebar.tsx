import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListFilter, 
  BrainCircuit, 
  Layers, 
  FileCheck, 
  ArrowLeft,
  Flame,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const Sidebar: React.FC = () => {
  const { complaints, kpis, setRole } = useCivic();

  const criticalCount = complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved' && c.status !== 'closed').length;
  const activeCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;

  return (
    <aside className="w-64 bg-[#0A0F1D]/85 backdrop-blur-3xl text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-white/10 shadow-[4px_0_32px_rgba(0,0,0,0.25)]">
      {/* Sidebar Header Lockup */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
              Municipal Console
            </div>
            <div className="text-sm font-bold text-white mt-0.5 tracking-tight">
              City Authority CAD
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 shadow-[0_0_8px_rgba(52,211,153,0.5)]" title="Connected to Dispatch CAD" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>SF Central Dispatch</span>
          <span>·</span>
          <span className="font-mono text-slate-300">CAD v3.2</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <NavLink
          to="/authority"
          end
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-blue-600/90 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] ring-1 ring-white/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-400" />
            <span>Authority Overview</span>
          </div>
        </NavLink>

        <NavLink
          to="/management"
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-blue-600/90 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] ring-1 ring-white/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <ListFilter className="w-4 h-4 shrink-0 text-sky-400" />
            <span>Complaint Management</span>
          </div>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/10 text-white border border-white/10">
              {activeCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/intelligence"
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-blue-600/90 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] ring-1 ring-white/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-4 h-4 shrink-0 text-purple-400" />
            <span>AI Intelligence & Clusters</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AI
          </span>
        </NavLink>

        <div className="pt-4 pb-1">
          <div className="px-3.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Triage Priority Queues
          </div>
        </div>

        <Link
          to="/management?priority=critical"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Critical Priority</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            {criticalCount}
          </span>
        </Link>

        <Link
          to="/management?status=in_progress"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Active Field Crews</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {complaints.filter(c => c.status === 'in_progress').length}
          </span>
        </Link>

        <Link
          to="/management?status=resolved"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Resolved This Week</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {kpis?.resolvedTodayCount || 23}
          </span>
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 space-y-2.5">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Authority CAD Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            All dispatch and status updates modify real-time state.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRole('citizen')}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Citizen Portal</span>
        </button>
      </div>
    </aside>
  );
};
