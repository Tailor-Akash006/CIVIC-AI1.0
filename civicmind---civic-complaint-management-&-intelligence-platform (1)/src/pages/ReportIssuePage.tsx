import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCivic } from '../context/CivicContext';
import { InteractiveMapPicker } from '../components/common/InteractiveMapPicker';
import { DemoNotice } from '../components/common/DemoNotice';
import { 
  Camera, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Image as ImageIcon,
  ShieldCheck,
  Send
} from 'lucide-react';
import { CivicCategory, LocationCoordinates, Complaint } from '../types';
import { CATEGORY_LABELS, SAMPLE_CIVIC_IMAGES } from '../services/mockData';
import { simulateAITriage } from '../services/api';

export const ReportIssuePage: React.FC = () => {
  const { submitComplaint } = useCivic();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CivicCategory>('roads_potholes');
  const [address, setAddress] = useState('742 Elmwood Ave');
  const [landmark, setLandmark] = useState('Near Lincoln Park entrance');
  const [ward, setWard] = useState('Ward 4 - Metro Center');
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({ lat: 37.7749, lng: -122.4194 });
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_CIVIC_IMAGES.pothole);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('Sarah Jenkins');
  const [reporterEmail, setReporterEmail] = useState('sarah.jenkins@example.org');
  const [reporterPhone, setReporterPhone] = useState('+1 (555) 678-9012');

  // Validation & UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Live dynamic AI simulation as user fills form
  const liveTriage = simulateAITriage(title || 'Incident', description || 'Report description', category, ward);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim() || title.length < 5) {
      newErrors.title = 'Please provide a clear title of at least 5 characters.';
    }
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'Please provide a descriptive explanation (minimum 15 characters).';
    }
    if (!address.trim()) {
      newErrors.address = 'Street address is required for dispatch dispatchers.';
    }
    if (!isAnonymous && !reporterName.trim()) {
      newErrors.reporterName = 'Please provide your name or toggle Anonymous reporting.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const complaint = await submitComplaint({
        title,
        description,
        category,
        address,
        ward,
        landmark,
        coordinates,
        imageUrl,
        isAnonymous,
        reporterName: isAnonymous ? 'Anonymous Citizen' : reporterName,
        reporterEmail: isAnonymous ? undefined : reporterEmail,
        reporterPhone: isAnonymous ? undefined : reporterPhone
      });

      setSubmittedComplaint(complaint);
    } catch (err) {
      console.error('Failed to submit complaint', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submitted successfully, show clear confirmation view
  if (submittedComplaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-950">
                  Complaint Filed Successfully
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your incident has entered the municipal dispatch pipeline.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">
                Official Tracking ID
              </span>
              <span className="font-mono text-lg font-black text-blue-600 bg-blue-50/80 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
                {submittedComplaint.trackingNumber}
              </span>
            </div>
          </div>

          {/* AI Intake Triage Assessment Result */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-4 shadow-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
                  Automated AI Triage Assessment
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">
                Priority: {submittedComplaint.aiAnalysis.priorityScore}/100 ({submittedComplaint.priority.toUpperCase()})
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {submittedComplaint.aiAnalysis.summary}
            </p>

            <div className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-white/10">
              <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">Primary Dispatch Factors:</span>
              <ul className="space-y-1">
                {submittedComplaint.aiAnalysis.priorityReasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <span className="text-blue-400 font-bold">›</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] text-slate-400">
              <span>Assigned Dept: <strong className="text-slate-200">{submittedComplaint.assignedDepartment}</strong></span>
              <span>Estimated Response: ~{submittedComplaint.aiAnalysis.estimatedResolutionHours} hours</span>
            </div>
          </div>

          {/* Submission Details Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/60 p-5 rounded-2xl border border-slate-200/60">
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase">Incident Title</span>
              <span className="font-bold text-slate-900">{submittedComplaint.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase">Category</span>
              <span className="font-bold text-slate-900">{submittedComplaint.categoryLabel}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase">Location</span>
              <span className="font-bold text-slate-900">{submittedComplaint.location.address} ({submittedComplaint.location.ward})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase">Reporter</span>
              <span className="font-bold text-slate-900">{submittedComplaint.reportedBy.name}</span>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              to={`/complaints/${submittedComplaint.id}`}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Track Resolution Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/citizen"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 rounded-full transition-all shadow-xs"
            >
              <span>Return to Citizen Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Report a Civic Issue
            </h1>
            <span className="text-[11px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Citizen Intake
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit public infrastructure defects, safety hazards, or utility disruptions directly to municipal crews.
          </p>
        </div>
        <DemoNotice type="ai" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Issue Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(CATEGORY_LABELS) as CivicCategory[]).map((catKey) => {
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-[0_2px_8px_rgba(37,99,235,0.15)] ring-1 ring-blue-600'
                        : 'glass-panel text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{CATEGORY_LABELS[catKey]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Complaint Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {title.length}/80
              </span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep asphalt pothole expanding near bike lane"
              className={`w-full px-4 py-2.5 text-xs bg-white/70 backdrop-blur-md border rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200/80 focus:border-blue-600'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {description.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, any visible hazard (water bubbling, traffic congestion, pedestrian danger), and how long this condition has persisted..."
              className={`w-full px-4 py-2.5 text-xs bg-white/70 backdrop-blur-md border rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.description ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200/80 focus:border-blue-600'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Photo Evidence with Presets & Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Photographic Evidence
            </label>
            <div className="glass-panel p-4 rounded-3xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Preview Thumbnail */}
                <div className="w-32 h-24 rounded-2xl bg-slate-900 border border-slate-200/60 overflow-hidden relative shrink-0 shadow-xs">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Incident preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[11px]">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                      <span>No image</span>
                    </div>
                  )}
                </div>

                {/* Upload or Choose Presets */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300/80 bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Your Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sample presets */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Quick Demo Photo Presets:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setImageUrl(SAMPLE_CIVIC_IMAGES.pothole)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100/80 hover:bg-white text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        Pothole
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(SAMPLE_CIVIC_IMAGES.waterleak)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100/80 hover:bg-white text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        Water Leak
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(SAMPLE_CIVIC_IMAGES.streetlight)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100/80 hover:bg-white text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        Broken Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(SAMPLE_CIVIC_IMAGES.waste)}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100/80 hover:bg-white text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        Waste Dump
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reporter Contact Info */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                5. Citizen Contact (For Notifications)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Submit Anonymously</span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600"
                  />
                  {errors.reporterName && (
                    <span className="text-[10px] text-rose-600 font-medium">{errors.reporterName}</span>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location & Interactive Map Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              6. Location & Municipal Ward <span className="text-rose-500">*</span>
            </label>

            {/* Address fields */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Street Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Elmwood Ave"
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600"
                  />
                </div>
                {errors.address && (
                  <span className="text-[10px] text-rose-600 font-medium">{errors.address}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. In front of Lincoln High School gate"
                  className="w-full px-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Municipal Ward</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-600 font-semibold"
                >
                  <option value="Ward 4 - Metro Center">Ward 4 - Metro Center</option>
                  <option value="Ward 2 - Commercial Harbor">Ward 2 - Commercial Harbor</option>
                  <option value="Ward 7 - South Heights">Ward 7 - South Heights</option>
                  <option value="Ward 3 - East District">Ward 3 - East District</option>
                  <option value="Ward 5 - Northgate">Ward 5 - Northgate</option>
                  <option value="Ward 1 - West Parklands">Ward 1 - West Parklands</option>
                </select>
              </div>
            </div>

            {/* Interactive Grid Map Pin Selection */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                Drop pin on municipal GIS grid to pinpoint exact coordinates:
              </span>
              <InteractiveMapPicker
                coordinates={coordinates}
                ward={ward}
                heightClass="h-64"
                onChange={(coords, wardName, suggestedAddress) => {
                  setCoordinates(coords);
                  setWard(wardName);
                  if (suggestedAddress) {
                    setAddress(suggestedAddress);
                  }
                }}
              />
            </div>
          </div>

          {/* Live AI Pre-submission Triage Preview Box */}
          <div className="p-5 rounded-3xl bg-slate-950 text-white space-y-3 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live AI Pre-Triage Prediction</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums bg-white/10 px-2 py-0.5 rounded-full">
                Score: {liveTriage.priorityScore}/100
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              {liveTriage.summary}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span>Risk: <strong className="text-slate-200 capitalize">{liveTriage.hazardRisk}</strong></span>
              <span>SLA Target: ~{liveTriage.estimatedResolutionHours}h</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(37,99,235,0.4)] ring-1 ring-white/20 disabled:opacity-60 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span>Analyzing & Dispatching...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Complaint to Dispatch</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
