export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIAnalysisResult {
  category: string;
  categoryConfidence: number;
  summary: string;
  urgencyType: 'immediate_hazard' | 'serious_damage' | 'public_health_risk' | 'routine_maintenance';
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  priorityReasons: string[];
  extractedTags: string[];
  estimatedResolutionHours: number;
  isFallback: boolean;
  modelUsed: string;
}

export interface DuplicateMatchResult {
  complaintId: string;
  trackingId: string;
  similarityScore: number; // 0 - 100
  distanceMeters: number;
  reason: string;
  isSuspectedDuplicate: boolean;
}
