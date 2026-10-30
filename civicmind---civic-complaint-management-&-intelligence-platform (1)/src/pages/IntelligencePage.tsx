import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DemoNotice } from '../components/common/DemoNotice';
import { InteractiveMapPicker } from '../components/common/InteractiveMapPicker';
import { 
  BrainCircuit, 
  Layers, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2,
  FileText,
  DollarSign,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { AIActionBrief } from '../types';

export const IntelligencePage: React.FC = () => {
  const { actionBriefs, hotspots, complaints, mergeDuplicateReport, showToast } = useCivic();
  const [activeTab, setActiveTab] = useState<'duplicates' | 'hotspots' | 'briefs'>('duplicates');
  const [selectedWard, setSelectedWard] = useState('Ward 4 - Metro Center');
  const [generatingBrief, setGeneratingBrief] = useState(false);

  // Extract complaints with duplicate candidates
  const complaintsWithDuplicates = complaints.filter(
    c => c.duplicateCandidates && c.duplicateCandidates.length > 0 && c.status !== 'closed'
  );

  const handleMergeInIntelligence = async (primaryId: string, dupId: string) => {
    await mergeDuplicateReport(primaryId, dupId);
  };

  const handleSimulateNewBrief = () => {
    setGeneratingBrief(true);
    setTimeout(() => {
      setGeneratingBrief(false);
      showToast('AI synthesized fresh municipal vulnerability brief based on latest incoming citizen reports');
    }, 1200);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F5F7FB] relative overflow-hidden">
      {/* Ambient Apple VisionOS Specular Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Deep Navy VisionOS Glass Sidebar */}
      <div className="hidden md:block relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden relative z-10">
        {/* Header Strip with Apple Glass styling */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Civic Intelligence & Duplicate Clustering
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20 backdrop-blur-md font-mono">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                Gemini Multi-Report Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cross-citizen report deduplication, predictive infrastructure hotspots, and executive action briefs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoNotice type="ai" />
            <button
              type="button"
              disabled={generatingBrief}
              onClick={handleSimulateNewBrief}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generatingBrief ? 'animate-spin' : ''}`} />
              <span>{generatingBrief ? 'Synthesizing...' : 'Synthesize AI Brief'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards - Apple Glass Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Duplicate Clustering Savings</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
              $18,450 <span className="text-xs font-normal text-slate-500">saved</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Eliminated 42 redundant truck rollouts this month
            </p>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Corroboration Confidence</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums tracking-tight">
              96.4%
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Spatial + text cosine embedding similarity
            </p>
          </div>

          <div className="glass-panel apple-card-hover p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Predictive Risk Hotspots</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums tracking-tight">
              3 Wards
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Elevated storm and infrastructure wear alert
            </p>
          </div>
        </div>

        {/* Apple VisionOS Segmented Section Switcher */}
        <div className="flex items-center p-1.5 bg-slate-200/60 backdrop-blur-xl rounded-full border border-white/80 max-w-lg text-xs font-semibold shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('duplicates')}
            className={`flex-1 py-2 px-3 rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'duplicates'
                ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Duplicate Clusters ({complaintsWithDuplicates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hotspots')}
            className={`flex-1 py-2 px-3 rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'hotspots'
                ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotspot GIS Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('briefs')}
            className={`flex-1 py-2 px-3 rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'briefs'
                ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Briefs ({actionBriefs.length})
          </button>
        </div>

        {/* Tab 1: Duplicate Clusters & Merge Review */}
        {activeTab === 'duplicates' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>AI Multi-Report Deduplication & Spatial Grouping</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  When multiple citizens report the same defect (pothole, water leak, or downed light), CIVICMIND identifies matches by geographic radius and semantic similarity to combine them into a unified dispatch ticket.
                </p>
              </div>

              {complaintsWithDuplicates.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-500 bg-white/60 rounded-2xl border border-white/80 backdrop-blur-md">
                  All active duplicate clusters have been resolved or merged.
                </div>
              ) : (
                <div className="space-y-4">
                  {complaintsWithDuplicates.map((primary) => (
                    <div
                      key={primary.id}
                      className="p-5 sm:p-6 rounded-2xl border border-white/90 bg-white/70 hover:bg-white/85 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4 text-xs transition-all"
                    >
                      {/* Primary root report */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 font-bold font-mono">
                              PRIMARY: {primary.trackingNumber}
                            </span>
                            <span className="text-slate-500 font-medium">{primary.location.ward}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1">
                            {primary.title}
                          </h3>
                        </div>
                        <div className="text-slate-700 font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                          Priority: {primary.aiAnalysis.priorityScore}/100
                        </div>
                      </div>

                      {/* Duplicate candidates list */}
                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">
                          Corroborating Reports Detected Nearby:
                        </span>

                        {primary.duplicateCandidates.map((dup) => (
                          <div
                            key={dup.complaintId}
                            className="p-4 rounded-xl bg-white/80 border border-purple-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 text-[11px]">{dup.trackingNumber}</span>
                                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 text-[11px]">{dup.similarityScore}% match</span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-500">{dup.distanceMeters}m away</span>
                              </div>
                              <p className="text-slate-700 font-medium">{dup.title}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleMergeInIntelligence(primary.id, dup.complaintId)}
                              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-[0_2px_10px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_14px_rgba(147,51,234,0.4)] whitespace-nowrap self-start sm:self-auto cursor-pointer"
                            >
                              Merge into Primary
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Hotspots */}
        {activeTab === 'hotspots' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left list (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Municipal Density Ranking
                </h3>
                <p className="text-xs text-slate-500">
                  Select a municipal ward to inspect incident density on the GIS grid.
                </p>

                <div className="space-y-2.5 pt-2">
                  {hotspots.map((h) => {
                    const isSelected = selectedWard.includes(h.ward);
                    return (
                      <div
                        key={h.id}
                        onClick={() => setSelectedWard(`${h.ward} - ${h.name}`)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-500/40 shadow-sm backdrop-blur-md' 
                            : 'bg-white/60 border-white/90 hover:bg-white/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{h.ward}: {h.name}</span>
                          <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded-md bg-white/80 shadow-2xs">{h.activeIncidents} active</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>Dominant: <strong className="text-slate-700">{h.dominantCategory}</strong></span>
                          <span className={`font-semibold ${h.changeWeekOverWeek > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {h.changeWeekOverWeek > 0 ? `+${h.changeWeekOverWeek}%` : `${h.changeWeekOverWeek}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Map (7 cols) */}
            <div className="lg:col-span-7 glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>GIS Hotspot Concentration Visualizer</span>
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-1 rounded-full bg-slate-200/50">{selectedWard}</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <InteractiveMapPicker
                  coordinates={{ lat: 37.779, lng: -122.418 }}
                  ward={selectedWard}
                  heightClass="h-96"
                  showHotspotPins={true}
                  interactive={false}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Action Briefs */}
        {activeTab === 'briefs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {actionBriefs.map((brief) => (
                <div
                  key={brief.id}
                  className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] p-6 sm:p-7 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
                          brief.severity === 'urgent' 
                            ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' 
                            : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                        }`}>
                          {brief.severity} Brief
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-700">{brief.zone}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mt-1">
                        {brief.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {brief.timestamp}
                    </span>
                  </div>

                  {/* Situation */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block">Situation Summary</span>
                    <p className="text-slate-700 leading-relaxed bg-white/70 p-4 rounded-2xl border border-white/90 shadow-xs">
                      {brief.situation}
                    </p>
                  </div>

                  {/* Recommended Municipal Action */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-blue-900 uppercase tracking-wider block">Recommended Resource Action</span>
                    <p className="text-blue-950 font-medium leading-relaxed bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-md">
                      {brief.recommendedAction}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 border-t border-slate-200/60">
                    <div>
                      <strong className="text-slate-900">Projected Impact:</strong> {brief.impactMetrics}
                    </div>
                    <div className="text-slate-500 font-mono">
                      {brief.affectedComplaintsCount} citizen tickets resolved simultaneously
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
