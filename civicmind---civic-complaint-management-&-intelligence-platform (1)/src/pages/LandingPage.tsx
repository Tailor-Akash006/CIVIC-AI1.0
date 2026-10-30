import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Layers, 
  MapPin, 
  Sparkles, 
  Camera, 
  ShieldAlert, 
  Search,
  Check,
  ChevronRight
} from 'lucide-react';
import { DemoNotice } from '../components/common/DemoNotice';
import { simulateAITriage } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [interactiveQuery, setInteractiveQuery] = useState(
    'Deep crater pothole opened in front of Lincoln Elementary, bike wheel popped'
  );
  const [selectedCat, setSelectedCat] = useState<'roads_potholes' | 'water_sewage' | 'street_lighting'>('roads_potholes');
  const [trackingSearch, setTrackingSearch] = useState('');

  // Live simulation output
  const liveAnalysis = simulateAITriage(
    'Civic Alert',
    interactiveQuery,
    selectedCat,
    'Ward 4 - Metro Center'
  );

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;
    navigate(`/complaints/${trackingSearch.trim()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Apple-style Hero Section with Ambient Glow */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  Municipal Civic Intelligence
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-blue-600 font-semibold">
                  AI-Powered Civic Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] text-balance">
                Every complaint matters. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  Every action counts.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                CIVICMIND turns scattered citizen reports into prioritized, explainable, and trackable municipal actions. Powered by automated Gemini AI triage, verified duplicate clustering, and rapid field crew dispatch.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.35)] ring-1 ring-white/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/authority"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-bold text-slate-800 bg-white/80 hover:bg-white rounded-full border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all whitespace-nowrap"
                >
                  <span>Authority CAD Console</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Apple Glass Search Bar */}
              <div className="pt-3">
                <form 
                  onSubmit={handleTrackSubmit} 
                  className="max-w-md flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={trackingSearch}
                    onChange={(e) => setTrackingSearch(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. CIV-2026-8941)..."
                    className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
                  >
                    Track
                  </button>
                </form>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 pl-2">
                  <span>Sample Tracking IDs:</span>
                  <button
                    type="button"
                    onClick={() => navigate('/complaints/CIV-2026-8941')}
                    className="text-blue-600 hover:underline font-mono font-medium"
                  >
                    CIV-2026-8941
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => navigate('/complaints/CIV-2026-8922')}
                    className="text-blue-600 hover:underline font-mono font-medium"
                  >
                    CIV-2026-8922
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Apple Glass Interactive Triage Playground (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-2xl text-white p-7 border border-white/10 shadow-[0_20px_50px_rgba(15,23,42,0.4)] overflow-hidden">
                {/* Background Specular Flare */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
                      Live AI Triage Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                    Interactive
                  </span>
                </div>

                {/* Input playground */}
                <div className="mt-5 space-y-3.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Test incident description:
                  </label>
                  <textarea
                    rows={3}
                    value={interactiveQuery}
                    onChange={(e) => setInteractiveQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />

                  {/* Category switcher */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCat('roads_potholes')}
                      className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-all ${selectedCat === 'roads_potholes' ? 'bg-blue-600 border-blue-500 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      Pothole
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCat('water_sewage')}
                      className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-all ${selectedCat === 'water_sewage' ? 'bg-blue-600 border-blue-500 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      Water Leak
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCat('street_lighting')}
                      className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-all ${selectedCat === 'street_lighting' ? 'bg-blue-600 border-blue-500 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      Blackout
                    </button>
                  </div>

                  {/* Realtime AI Output Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">Calculated Urgency Score</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xl font-bold text-blue-400 tabular-nums">
                          {liveAnalysis.priorityScore}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">/100</span>
                      </div>
                    </div>

                    {/* Glowing Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          liveAnalysis.priorityScore >= 85 
                            ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]' 
                            : liveAnalysis.priorityScore >= 70 
                            ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                            : 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                        }`}
                        style={{ width: `${liveAnalysis.priorityScore}%` }}
                      />
                    </div>

                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                        Transparent AI Reasoning:
                      </span>
                      <ul className="space-y-1">
                        {liveAnalysis.priorityReasons.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                            <span className="text-blue-400 font-bold">›</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
                      <span>Dispatch SLA: ~{liveAnalysis.estimatedResolutionHours}h</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Ready for Intake
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <DemoNotice type="ai" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-14 border-y border-slate-200/60 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
                Municipal Performance
              </span>
              <h2 className="text-2xl font-bold text-slate-950 mt-0.5">
                Demonstrated Civic Impact Metrics
              </h2>
            </div>
            <DemoNotice type="analytics" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-panel p-6 rounded-3xl apple-card-hover">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Avg Resolution Time</span>
              </div>
              <div className="text-3xl font-black text-slate-950 mt-2 font-mono tabular-nums">
                4.8 <span className="text-sm font-normal text-slate-500">hours</span>
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">
                -62% vs manual hotline
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Duplicate Clustering</span>
              </div>
              <div className="text-3xl font-black text-slate-950 mt-2 font-mono tabular-nums">
                36.4%
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Merged to save truck runs
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Triage Accuracy</span>
              </div>
              <div className="text-3xl font-black text-slate-950 mt-2 font-mono tabular-nums">
                95.8%
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Verified category & ward routing
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Citizen Satisfaction</span>
              </div>
              <div className="text-3xl font-black text-slate-950 mt-2 font-mono tabular-nums">
                91.2%
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Transparent step-by-step audit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Resolution Pipeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
              The 4-Stage Resolution Pipeline
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight mt-1.5">
              From Citizen Report to Field Verification
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              A transparent closed-loop system where citizens stay informed at every step and city dispatchers work with prioritized intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl apple-card-hover space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center font-black text-xs shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Snap & Geotag
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens submit photos, auto-detect coordinates or place an interactive GIS pin with offline resilience.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center font-black text-xs shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-950">
                AI Classification & Risk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini AI scores urgency based on proximity to school corridors, weather forecasts, and transit bottlenecks.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-700 flex items-center justify-center font-black text-xs shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Duplicate Deduplication
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clustering algorithms group multiple reports of the same pothole or leak, routing a single optimized ticket.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl apple-card-hover space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center font-black text-xs shadow-xs">
                04
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Verified Resolution
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field technicians log resolution timestamps and completion proof. Citizen receives instant progress notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Strip */}
      <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-slate-950 to-indigo-950/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to experience proactive civic governance?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Report an issue as a citizen or explore the municipal authority dashboard to inspect automated triage and cluster management in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="px-6 py-3.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-full shadow-[0_4px_16px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-0.5"
            >
              Report an Issue Now
            </Link>
            <Link
              to="/citizen"
              className="px-6 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              View Citizen Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
