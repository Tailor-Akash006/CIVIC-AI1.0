/**
 * CIVICMIND Data Models & Type Definitions
 * Structured for enterprise NestJS REST API integration
 */

export type ComplaintStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';

export type CivicCategory = 
  | 'roads_potholes'
  | 'street_lighting'
  | 'water_sewage'
  | 'sanitation_waste'
  | 'traffic_signals'
  | 'public_safety'
  | 'parks_trees'
  | 'other';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface ComplaintLocation {
  address: string;
  ward: string;
  landmark?: string;
  coordinates: LocationCoordinates;
  city: string;
}

export interface AIAnalysis {
  categoryConfidence: number; // 0 - 1
  sentimentScore: 'frustrated' | 'urgent' | 'neutral' | 'calm';
  priorityScore: number; // 0 - 100
  priorityLevel: ComplaintPriority;
  priorityReasons: string[];
  extractedTags: string[];
  summary: string;
  estimatedResolutionHours: number;
  hazardRisk: 'critical' | 'moderate' | 'low';
}

export interface DuplicateCandidate {
  complaintId: string;
  trackingNumber: string;
  title: string;
  distanceMeters: number;
  similarityScore: number; // 0 - 100
  reportedAt: string;
  status: ComplaintStatus;
}

export interface StatusTimelineEntry {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  actor: string;
  actorRole: 'citizen' | 'ai_system' | 'dispatcher' | 'field_crew' | 'admin';
  note: string;
  actionTaken?: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string; // e.g. CIV-2026-8941
  title: string;
  description: string;
  category: CivicCategory;
  categoryLabel: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  location: ComplaintLocation;
  imageUrl?: string;
  reportedBy: {
    name: string;
    phone?: string;
    email?: string;
    isAnonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  aiAnalysis: AIAnalysis;
  duplicateCandidates: DuplicateCandidate[];
  isMergedInto?: string; // id of primary complaint if merged
  mergedCount?: number; // count of merged complaints
  timeline: StatusTimelineEntry[];
}

export interface NewComplaintPayload {
  title: string;
  description: string;
  category: CivicCategory;
  address: string;
  ward: string;
  landmark?: string;
  coordinates: LocationCoordinates;
  imageUrl?: string;
  isAnonymous?: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
}

export interface AuthorityKPIs {
  totalComplaints: number;
  activeComplaints: number;
  criticalUrgentCount: number;
  resolvedTodayCount: number;
  avgResolutionTimeHours: number;
  duplicateClusteringRate: number; // percentage
  aiTriageAccuracy: number; // percentage
  satisfactionRate: number; // percentage
}

export interface HotspotZone {
  id: string;
  ward: string;
  name: string;
  activeIncidents: number;
  dominantCategory: string;
  riskLevel: 'high' | 'medium' | 'low';
  coordinates: LocationCoordinates;
  changeWeekOverWeek: number; // e.g. +14%
}

export interface AIActionBrief {
  id: string;
  title: string;
  zone: string;
  category: string;
  severity: 'urgent' | 'advisory' | 'info';
  timestamp: string;
  situation: string;
  recommendedAction: string;
  impactMetrics: string;
  affectedComplaintsCount: number;
}

export type UserRole = 'citizen' | 'authority';
