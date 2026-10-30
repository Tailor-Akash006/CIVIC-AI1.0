import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { Sidebar } from '../components/layout/Sidebar';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityMeter } from '../components/common/PriorityMeter';
import { DemoNotice } from '../components/common/DemoNotice';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  X, 
  ShieldCheck, 
  ArrowUpDown,
  Wrench,
  ChevronRight,
  Sparkles,
  Zap,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Complaint, ComplaintStatus, ComplaintPriority, CivicCategory } from '../types';
import { CATEGORY_LABELS } from '../services/mockData';

export const ComplaintManagementPage: React.FC = () => {
  const { complaints, updateStatus, showToast } = useCivic();
  const [searchParams] = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [priorityFilter, setPriorityFilter] = useState<string>(searchParams.get('priority') || 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Slide-over drawer state
  const [inspectingComplaint, setInspectingComplaint] = useState<Complaint | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<'createdAt' | 'priorityScore'>('priorityScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter complaints
  const filtered = complaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (wardFilter !== 'all' && !c.location.ward.includes(wardFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        c.title.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.reportedBy.name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortField === 'priorityScore') {
      const diff = b.aiAnalysis.priorityScore - a.aiAnalysis.priorityScore;
      return sortAsc ? -diff : diff;
    } else {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortAsc ? -diff : diff;
    }
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = async (newStatus: ComplaintStatus) => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await updateStatus(id, newStatus, `Bulk status transitioned to ${newStatus}`);
    }
    showToast(`Updated ${selectedIds.length} complaints to ${newStatus.replace('_', ' ').toUpperCase()}`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Tracking ID,Title,Category,Status,Priority,Ward,Address,Reported At\n"
      + filtered.map(c => 
          `"${c.trackingNumber}","${c.title.replace(/"/g, '""')}","${c.categoryLabel}","${c.status}","${c.priority}","${c.location.ward}","${c.location.address}","${c.createdAt}"`
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `civicmind_complaints_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} records to CSV`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F5F7FB] relative overflow-hidden">
      {/* Ambient Apple VisionOS Specular Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Deep Navy VisionOS Sidebar */}
      <div className="hidden md:block relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden relative z-10">
        {/* Header Strip with Apple Glass styling */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Complaint Registry & Dispatch Management
              </h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200/60 text-slate-700 border border-white/80 font-mono">
                {filtered.length} records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Search, filter, assign field units, and execute bulk municipal actions across all reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoNotice type="general" />
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white/80 hover:bg-white border border-white/90 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter and Control Bar - Apple Glass Style */}
        <div className="glass-panel rounded-3xl p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking ID, title, citizen, address..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/70 hover:bg-white/90 border border-white/90 rounded-2xl shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/70 hover:bg-white/90 border border-white/90 rounded-2xl text-slate-700 shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed / Merged</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="lg:col-span-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/70 hover:bg-white/90 border border-white/90 rounded-2xl text-slate-700 shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="all">Priority: All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/70 hover:bg-white/90 border border-white/90 rounded-2xl text-slate-700 shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="all">Category: All</option>
                {Object.keys(CATEGORY_LABELS).map(catKey => (
                  <option key={catKey} value={catKey}>{CATEGORY_LABELS[catKey]}</option>
                ))}
              </select>
            </div>

            {/* Ward Filter */}
            <div className="lg:col-span-2">
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/70 hover:bg-white/90 border border-white/90 rounded-2xl text-slate-700 shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="all">Ward: All</option>
                <option value="Ward 4">Ward 4 (Metro Center)</option>
                <option value="Ward 2">Ward 2 (Commercial)</option>
                <option value="Ward 7">Ward 7 (South Heights)</option>
                <option value="Ward 3">Ward 3 (East District)</option>
                <option value="Ward 5">Ward 5 (Northgate)</option>
              </select>
            </div>
          </div>

          {/* Bulk Action Bar (when rows are selected) - Translucent Apple Glass Pill */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl text-xs shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <span>{selectedIds.length} complaints selected</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-[11px] font-medium">Batch Transition:</span>
                <button
                  type="button"
                  onClick={() => handleBulkStatus('in_progress')}
                  className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-full border border-white/90 font-medium shadow-xs transition-all cursor-pointer"
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatus('resolved')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium shadow-[0_2px_8px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white/60 transition-colors"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Complaints Data Grid - Apple VisionOS Translucent Table */}
        <div className="glass-panel rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200/60 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-10">
                    <button type="button" onClick={handleSelectAll} className="p-0.5 cursor-pointer">
                      {selectedIds.length === filtered.length && filtered.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Tracking ID</th>
                  <th className="py-3.5 px-4">Complaint Title & Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th 
                    className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 transition-colors"
                    onClick={() => {
                      if (sortField === 'priorityScore') setSortAsc(!sortAsc);
                      else { setSortField('priorityScore'); setSortAsc(false); }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>AI Priority</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Crew</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No complaints matched the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const isSelected = selectedIds.includes(c.id);
                    return (
                      <tr 
                        key={c.id} 
                        className={`hover:bg-white/80 transition-colors ${isSelected ? 'bg-blue-500/10' : ''}`}
                      >
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(c.id)}
                            className="p-0.5 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-lg bg-slate-200/50 text-[11px]">
                            {c.trackingNumber}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div 
                            onClick={() => setInspectingComplaint(c)}
                            className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {c.location.address} · {c.location.ward.split(' - ')[0]}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                          {c.categoryLabel}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PriorityMeter priority={c.priority} score={c.aiAnalysis.priorityScore} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-[160px] truncate" title={c.assignedDepartment}>
                          {c.assignedOfficer || c.assignedDepartment || 'Unassigned'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick status cycle button */}
                            {c.status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => updateStatus(c.id, c.status === 'in_progress' ? 'resolved' : 'in_progress')}
                                className="px-2.5 py-1 rounded-full bg-slate-200/60 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-[11px] transition-all cursor-pointer"
                                title="Advance status"
                              >
                                {c.status === 'in_progress' ? 'Resolve' : 'Dispatch'}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setInspectingComplaint(c)}
                              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all cursor-pointer"
                              title="Inspect Drawer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            <Link
                              to={`/complaints/${c.id}`}
                              className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-white/80 transition-all"
                              title="Full page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slide-over Inspection Drawer - Apple VisionOS Frosted Sheet */}
        {inspectingComplaint && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white/90 backdrop-blur-3xl h-full shadow-2xl p-6 sm:p-7 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-white/80">
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-blue-600">{inspectingComplaint.trackingNumber}</span>
                      <span>·</span>
                      <span>{inspectingComplaint.location.ward}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {inspectingComplaint.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectingComplaint(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status + Priority */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={inspectingComplaint.status} size="md" />
                  <PriorityMeter 
                    priority={inspectingComplaint.priority} 
                    score={inspectingComplaint.aiAnalysis.priorityScore} 
                    size="md" 
                  />
                </div>

                {/* Description & Image */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-4 rounded-2xl border border-white/90 shadow-xs">
                    {inspectingComplaint.description}
                  </p>
                </div>

                {inspectingComplaint.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/90 max-h-48 bg-slate-900 shadow-md">
                    <img 
                      src={inspectingComplaint.imageUrl} 
                      alt="Complaint" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                )}

                {/* AI Summary - VisionOS Blue Tinted Glass */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl space-y-2 text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    AI Triage Summary
                  </span>
                  <p className="text-blue-950 leading-relaxed">
                    {inspectingComplaint.aiAnalysis.summary}
                  </p>
                  <div className="text-[11px] text-blue-800 pt-2 border-t border-blue-500/20 font-medium">
                    Primary Reason: {inspectingComplaint.aiAnalysis.priorityReasons[0]}
                  </div>
                </div>

                {/* Quick Status Advance within Drawer */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-700 block">Transition Status</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['assigned', 'in_progress', 'resolved'] as ComplaintStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={async () => {
                          const updated = await updateStatus(inspectingComplaint.id, st, `Status updated via drawer`);
                          setInspectingComplaint(updated);
                        }}
                        className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                          inspectingComplaint.status === st
                            ? 'bg-blue-600 border-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]'
                            : 'bg-white/80 border-white/90 text-slate-700 hover:bg-white shadow-xs'
                        }`}
                      >
                        {st.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  to={`/complaints/${inspectingComplaint.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <span>Open Full Dossier Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setInspectingComplaint(null)}
                  className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
