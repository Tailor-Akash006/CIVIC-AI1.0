import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { Sidebar } from '../components/layout/Sidebar';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityMeter } from '../components/common/PriorityMeter';
import { DemoNotice } from '../components/common/DemoNotice';
import { InteractiveMapPicker } from '../components/common/InteractiveMapPicker';
import { 
  AlertTriangle, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Flame, 
  ArrowUpRight, 
  TrendingUp, 
  MapPin, 
  Wrench,
  Users,
  ChevronRight,
  Filter,
  Sparkles,
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AuthorityDashboard: React.FC = () => {
  const { complaints, kpis, hotspots, updateStatus } = useCivic();
  const [selectedQueueCategory, setSelectedQueueCategory] = useState<string>('all');

  // Trend data for Recharts
  const weeklyTrends = [
    { day: 'Mon', filed: 42, resolved: 38 },
    { day: 'Tue', filed: 56, resolved: 49 },
    { day: 'Wed', filed: 68, resolved: 54 },
    { day: 'Thu', filed: 61, resolved: 59 },
    { day: 'Fri', filed: 74, resolved: 65 },
    { day: 'Sat', filed: 39, resolved: 44 },
    { day: 'Sun', filed: 31, resolved: 36 }
  ];

  // Category breakdown data
  const categoryData = [
    { name: 'Roads & Potholes', value: 38, color: '#3B82F6' },
    { name: 'Water & Sewage', value: 24, color: '#0EA5E9' },
    { name: 'Street Lighting', value: 16, color: '#F59E0B' },
    { name: 'Sanitation & Waste', value: 14, color: '#10B981' },
    { name: 'Traffic & Signals', value: 8, color: '#8B5CF6' }
  ];

  // Critical & high priority complaints needing immediate attention
  const priorityQueue = complaints
    .filter(c => c.status !== 'resolved' && c.status !== 'closed')
    .sort((a, b) => b.aiAnalysis.priorityScore - a.aiAnalysis.priorityScore)
    .filter(c => selectedQueueCategory === 'all' || c.category === selectedQueueCategory);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F5F7FB] relative overflow-hidden">
      {/* Ambient Apple VisionOS Specular Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Deep Navy VisionOS Glass Sidebar */}
      <div className="hidden md:block relative z-10">
        <Sidebar />
      </div>

      {/* Main Authority Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden relative z-10">
        {/* Header Strip with Apple Glass styling */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Municipal Authority Operations
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-700 border border-blue-500/20 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Vision CAD Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated AI triage queue, field resource allocation, and municipal ward risk metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoNotice type="analytics" />
            <Link
              to="/management"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white/80 hover:bg-white border border-white/90 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:shadow-md"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Management Table</span>
            </Link>
          </div>
        </div>

        {/* 5 KPI Metric Cards - Apple Glass Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Active Backlog</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <Wrench className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {kpis?.activeComplaints || complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
                  -8%
                </span>
                <span>vs last week</span>
              </div>
            </div>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Critical Hazards</span>
              <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight tabular-nums">
                {complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length}
              </div>
              <div className="text-[11px] text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-500" />
                <span>Under 4hr SLA response</span>
              </div>
            </div>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Avg Resolution SLA</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-blue-600 font-mono tracking-tight tabular-nums">
                {kpis?.avgResolutionTimeHours || 4.8} <span className="text-sm font-normal text-slate-500">hrs</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Target: &lt;6.0 hours</span>
              </div>
            </div>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Duplicate Merging</span>
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-purple-600 font-mono tracking-tight tabular-nums">
                {kpis?.duplicateClusteringRate || 36.4}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                Saves redundant crew trips
              </div>
            </div>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Resolved Today</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums">
                {kpis?.resolvedTodayCount || 23}
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified by citizens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Dispatch Queue Section */}
        <div id="queue" className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Priority Dispatch Queue (AI Ranked)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Complaints requiring immediate dispatch assignment based on computed risk score and public safety impact.
              </p>
            </div>

            {/* Apple macOS style segmented filter bar */}
            <div className="flex items-center p-1 bg-slate-200/50 backdrop-blur-md rounded-full border border-white/60 overflow-x-auto text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setSelectedQueueCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedQueueCategory === 'all' 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Sectors
              </button>
              <button
                type="button"
                onClick={() => setSelectedQueueCategory('roads_potholes')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedQueueCategory === 'roads_potholes' 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roads
              </button>
              <button
                type="button"
                onClick={() => setSelectedQueueCategory('water_sewage')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedQueueCategory === 'water_sewage' 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Water
              </button>
              <button
                type="button"
                onClick={() => setSelectedQueueCategory('street_lighting')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedQueueCategory === 'street_lighting' 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lighting
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {priorityQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-white/90 bg-white/60 hover:bg-white/80 backdrop-blur-xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded-md bg-slate-200/50">
                      {item.trackingNumber}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700">{item.categoryLabel}</span>
                    <span>·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location.ward}
                    </span>
                    <span>·</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{item.location.address}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-600 flex items-center gap-2 bg-slate-100/60 rounded-xl px-3 py-1.5 border border-slate-200/40">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-slate-400 font-medium">AI Reasoning:</span>
                    <span className="text-slate-700 font-medium italic">{item.aiAnalysis.priorityReasons[0]}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <PriorityMeter priority={item.priority} score={item.aiAnalysis.priorityScore} size="sm" />
                  <StatusBadge status={item.status} size="sm" />

                  {/* Inline Fast Status Action */}
                  {item.status !== 'in_progress' ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'in_progress', 'Field team dispatched by authority')}
                      className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)] cursor-pointer"
                    >
                      Dispatch Squad
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'resolved', 'Verified resolved on site by crew')}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_14px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}

                  <Link
                    to={`/complaints/${item.id}`}
                    className="p-2 rounded-full border border-white/80 bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 shadow-xs transition-all hover:scale-105"
                    title="View details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Split: Complaint Trends (7 cols) & Category Breakdown (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trends Chart */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Weekly Complaint Volume vs Resolved Output
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time pace of incoming citizen reports compared with crew resolution completions.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-blue-600 font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Incoming
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Resolved
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff', 
                      fontSize: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="filed" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Donut */}
          <div className="lg:col-span-5 glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion by municipal infrastructure service.
              </p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff', 
                      fontSize: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list in Apple frosted style */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200/60">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-700 font-medium">{c.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Hotspot Section - Apple VisionOS Glass */}
        <div className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Geographic Hotspot Surveillance
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ward-by-ward density surveillance to deploy preventative street sweeps and repair crews.
              </p>
            </div>
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 transition-all"
            >
              <span>View full AI intelligence clustering</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Hotspot Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {hotspots.map((z) => (
                <div
                  key={z.id}
                  className="p-4 rounded-2xl border border-white/90 bg-white/60 hover:bg-white/80 backdrop-blur-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{z.ward}: {z.name}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Dominant: <strong className="text-slate-700 font-semibold">{z.dominantCategory}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {z.activeIncidents} <span className="text-[10px] text-slate-500 font-normal">active</span>
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${z.changeWeekOverWeek > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {z.changeWeekOverWeek > 0 ? `+${z.changeWeekOverWeek}%` : `${z.changeWeekOverWeek}%`} vs last wk
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotspot Visualizer Map (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <InteractiveMapPicker
                coordinates={{ lat: 37.779, lng: -122.418 }}
                ward="Ward 4 - Metro Center"
                heightClass="h-72"
                showHotspotPins={true}
                interactive={false}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
