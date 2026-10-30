import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityMeter } from '../components/common/PriorityMeter';
import { DemoNotice } from '../components/common/DemoNotice';
import { InteractiveMapPicker } from '../components/common/InteractiveMapPicker';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Layers, 
  Clock, 
  Share2, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ComplaintStatus, Complaint } from '../types';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complaints, updateStatus, mergeDuplicateReport, showToast } = useCivic();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('in_progress');
  const [statusNote, setStatusNote] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = complaints.find(c => c.id === id || c.trackingNumber.toLowerCase() === id.toLowerCase());
    if (found) {
      setComplaint(found);
      setSelectedStatus(found.status);
      setAssignedOfficer(found.assignedOfficer || '');
    }
  }, [id, complaints]);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">
          The complaint reference <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{id}</code> does not exist in the municipal register.
        </p>
        <Link
          to="/citizen"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Citizen Portal
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateStatus(
        complaint.id,
        selectedStatus,
        statusNote || `Status updated to ${selectedStatus.replace('_', ' ').toUpperCase()}`,
        assignedOfficer || 'Municipal Officer'
      );
      setStatusNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMerge = async (duplicateId: string) => {
    await mergeDuplicateReport(complaint.id, duplicateId);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Direct tracking link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200/60 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link to="/citizen" className="hover:underline">Citizens</Link>
              <span>/</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{complaint.trackingNumber}</span>
              <span>/</span>
              <span>Dossier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
              {complaint.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DemoNotice type="ai" />
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 8 cols Content, Right 4 cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <StatusBadge status={complaint.status} size="md" />
                <PriorityMeter 
                  priority={complaint.priority} 
                  score={complaint.aiAnalysis.priorityScore} 
                  size="md" 
                />
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported on {new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Citizen Statement & Evidence
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Image Preview with Zoom / Visual styling */}
            {complaint.imageUrl && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Attached Visual Evidence</h4>
                <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-900 max-h-96 flex items-center justify-center shadow-md">
                  <img
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Metadata 4-Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/60 border border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold text-[11px] uppercase">Category</span>
                <span className="font-bold text-slate-900">{complaint.categoryLabel}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[11px] uppercase">Municipal Ward</span>
                <span className="font-bold text-slate-900">{complaint.location.ward}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[11px] uppercase">Reporter</span>
                <span className="font-bold text-slate-900">{complaint.reportedBy.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[11px] uppercase">Assigned Unit</span>
                <span className="font-bold text-slate-900 truncate block" title={complaint.assignedDepartment}>
                  {complaint.assignedDepartment || 'Dispatch Queue'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Intelligence & Priority Breakdown */}
          <div className="bg-slate-950 text-white rounded-3xl border border-white/10 p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  AI Triage & Transparent Scoring Rationale
                </h3>
              </div>
              <span className="text-xs font-mono text-blue-300 bg-white/10 px-2 py-0.5 rounded-full">
                Confidence: {Math.round(complaint.aiAnalysis.categoryConfidence * 100)}%
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Incident Summary:</span>
              <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/10">
                {complaint.aiAnalysis.summary}
              </p>
            </div>

            {/* Transparent Priority Reasons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Why was this scored {complaint.aiAnalysis.priorityScore}/100?</span>
                <span className="text-[11px] text-slate-400 font-mono">Safety Risk: {complaint.aiAnalysis.hazardRisk.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {complaint.aiAnalysis.priorityReasons.map((reason, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-black/30 border border-white/10 text-xs flex items-start gap-2">
                    <span className="text-blue-400 font-bold">›</span>
                    <span className="text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Extracted Signals:</span>
              {complaint.aiAnalysis.extractedTags.map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Duplicate Detection & Merging Panel */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Corroborating Reports & Possible Duplicates
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {complaint.duplicateCandidates?.length || 0} candidate(s)
              </span>
            </div>

            {complaint.duplicateCandidates && complaint.duplicateCandidates.length > 0 ? (
              <div className="space-y-3">
                {complaint.duplicateCandidates.map((dup) => (
                  <div 
                    key={dup.complaintId}
                    className="p-4 rounded-2xl bg-white/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{dup.trackingNumber}</span>
                        <span>·</span>
                        <span className="text-purple-700 font-semibold">{dup.similarityScore}% text/geo match</span>
                        <span>·</span>
                        <span className="text-slate-500">{dup.distanceMeters}m away</span>
                      </div>
                      <p className="font-medium text-slate-700">{dup.title}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/complaints/${dup.complaintId}`}
                        className="p-1.5 text-slate-400 hover:text-slate-700"
                        title="Inspect duplicate"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleMerge(dup.complaintId)}
                        className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs"
                      >
                        Merge Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-white/50 p-3.5 rounded-2xl border border-slate-200/60 font-medium">
                No active duplicate reports detected within a 150-meter radius. This appears to be a unique primary incident.
              </p>
            )}
          </div>

          {/* Full Audit Timeline */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Full Audit Trail & Dispatch History</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.timeline.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{entry.actor} ({entry.actorRole})</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white/60 p-3 rounded-2xl border border-slate-200/60 font-medium">
                      {entry.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authority Controls & Location Map (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Authority Dispatch Action Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Municipal Dispatch Control
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20">
                Action Panel
              </span>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Change Complaint Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3.5 py-2 text-xs bg-white/80 border border-slate-200/80 rounded-xl focus:border-blue-600 font-semibold"
                >
                  <option value="submitted">Submitted (New)</option>
                  <option value="under_review">Under Review / AI Triage</option>
                  <option value="assigned">Assigned to Dept</option>
                  <option value="in_progress">In Progress (Field Crew On Site)</option>
                  <option value="resolved">Resolved (Completed)</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Assigned Officer / Crew Lead
                </label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  placeholder="e.g. Supervisor Marcus Vance"
                  className="w-full px-3.5 py-2 text-xs bg-white/80 border border-slate-200/80 rounded-xl focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Action Note / Dispatch Update
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Field crew deployed with cold asphalt mix. Repair finished and tested."
                  className="w-full px-3.5 py-2 text-xs bg-white/80 border border-slate-200/80 rounded-xl focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] ring-1 ring-white/20 disabled:opacity-60 cursor-pointer text-xs transform hover:-translate-y-0.5"
              >
                {isUpdating ? 'Saving Update...' : 'Commit Status & Dispatch Note'}
              </button>
            </form>
          </div>

          {/* Interactive Geographic Location Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Geographic Location</span>
            </h3>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900">{complaint.location.address}</div>
              <div className="font-medium">{complaint.location.ward}</div>
              {complaint.location.landmark && (
                <div className="text-slate-500 italic">Ref: {complaint.location.landmark}</div>
              )}
            </div>

            <InteractiveMapPicker
              coordinates={complaint.location.coordinates}
              ward={complaint.location.ward}
              interactive={false}
              heightClass="h-52"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
