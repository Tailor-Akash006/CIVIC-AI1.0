import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityMeter } from '../components/common/PriorityMeter';
import { DemoNotice } from '../components/common/DemoNotice';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  FileSearch,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

export const CitizenDashboard: React.FC = () => {
  const { complaints, loading } = useCivic();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    complaints[0]?.id || 'c-8941'
  );

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        c.title.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedComplaint: Complaint | undefined = 
    complaints.find(c => c.id === selectedComplaintId) || filteredComplaints[0];

  const countTotal = complaints.length;
  const countInReview = complaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const countInProgress = complaints.filter(c => c.status === 'assigned' || c.status === 'in_progress').length;
  const countResolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Citizen Portal & Live Tracker
            </h1>
            <span className="text-[11px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Live CAD Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of civic maintenance reports, field dispatch updates, and verified resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoNotice type="general" />
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.35)] ring-1 ring-white/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Report</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl apple-card-hover">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Reported</span>
            <FileSearch className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 font-mono tabular-nums">
            {countTotal}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all municipal sectors</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl apple-card-hover">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>In Triage / Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono tabular-nums">
            {countInReview}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">AI assessment & dispatch check</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl apple-card-hover">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Crew Dispatched</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 font-mono tabular-nums">
            {countInProgress}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active repair squads on site</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl apple-card-hover">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono tabular-nums">
            {countResolved}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">100% verified complete</div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaint List & Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Apple Glass Search & Filter Bar */}
          <div className="glass-panel p-3 rounded-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, or address..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/60 border border-slate-200/80 rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* macOS Style Segmented Filters */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200/40 rounded-full text-xs">
              {['all', 'submitted', 'in_progress', 'resolved'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st === 'in_progress' ? 'In Progress' : st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 glass-panel rounded-3xl">
              Loading civic records...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
              <p className="text-sm font-bold text-slate-800">No complaints found</p>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Try clearing your search query' : 'Be the first to report an issue in your neighborhood.'}
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-full shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> File a Report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((item) => {
                const isSelected = item.id === selectedComplaint?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedComplaintId(item.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/95 border-blue-500 shadow-[0_8px_24px_rgba(37,99,235,0.12)] ring-2 ring-blue-500/20'
                        : 'glass-panel hover:bg-white/90 apple-card-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.trackingNumber}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-slate-600">{item.categoryLabel}</span>
                          <span>·</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[280px]">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{item.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityMeter priority={item.priority} score={item.aiAnalysis.priorityScore} size="sm" />
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Status Tracker & Timeline (5 cols) */}
        <div className="lg:col-span-5">
          {selectedComplaint ? (
            <div className="glass-panel rounded-3xl p-6 space-y-6 sticky top-20 shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                      {selectedComplaint.trackingNumber}
                    </span>
                    <span>·</span>
                    <span>{selectedComplaint.location.ward}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-950 mt-1.5">
                    {selectedComplaint.title}
                  </h2>
                </div>
                <Link
                  to={`/complaints/${selectedComplaint.id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-white/80 transition-colors"
                  title="Open full complaint dossier"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Status and Priority Overview */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/60 border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold text-[11px] uppercase">Current State</span>
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold text-[11px] uppercase">Assessed Urgency</span>
                  <PriorityMeter 
                    priority={selectedComplaint.priority} 
                    score={selectedComplaint.aiAnalysis.priorityScore} 
                    size="sm" 
                  />
                </div>
              </div>

              {/* AI Brief box */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Incident Triage Assessment</span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed font-medium">
                  {selectedComplaint.aiAnalysis.summary}
                </p>
                <div className="text-[11px] text-blue-800 pt-1.5 border-t border-blue-500/20 flex items-center justify-between">
                  <span>Assigned: {selectedComplaint.assignedDepartment || 'Public Works Triage'}</span>
                  <span>Est. SLA: {selectedComplaint.aiAnalysis.estimatedResolutionHours}h</span>
                </div>
              </div>

              {/* Step-by-Step Resolution Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500">
                  Step-by-Step Resolution Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedComplaint.timeline.map((entry, idx) => {
                    const isLatest = idx === selectedComplaint.timeline.length - 1;
                    return (
                      <div key={entry.id} className="relative group">
                        {/* Dot indicator */}
                        <div 
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                            isLatest ? 'border-blue-600 text-blue-600 ring-4 ring-blue-50 shadow-sm' : 'border-slate-300'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-blue-600' : 'bg-slate-400'}`} />
                        </div>

                        {/* Content */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-slate-900">
                              {entry.actor}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {entry.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View Full Dossier Link */}
              <div className="pt-2">
                <Link
                  to={`/complaints/${selectedComplaint.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white/80 hover:bg-white rounded-full transition-all border border-slate-200/80 shadow-xs"
                >
                  <span>View Full Complaint Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center glass-panel rounded-3xl text-slate-400 text-xs">
              Select a complaint from the list to track live progress
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
