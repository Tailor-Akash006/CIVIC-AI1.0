import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResult, DuplicateMatchResult, PriorityLevel } from './interfaces/ai-analysis.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenAI | null = null;
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
        this.logger.log('Gemini AI client initialized successfully');
      } catch (err: any) {
        this.logger.warn(`Failed to initialize Gemini AI client: ${err?.message}`);
      }
    } else {
      this.logger.warn('No GEMINI_API_KEY configured. Rule-based transparent fallback engine will be used.');
    }
  }

  /**
   * Main AI Processing Pipeline:
   * A. Categorization
   * B. Summarization
   * C. Urgency Detection
   * E. Explainable Prioritization (0-100)
   */
  async analyzeComplaint(params: {
    title: string;
    description: string;
    providedCategory?: string;
    latitude: number;
    longitude: number;
    address?: string;
    ward?: string;
  }): Promise<AIAnalysisResult> {
    const { title, description, providedCategory, address, ward } = params;

    // Try Gemini LLM first if configured
    if (this.genAI) {
      try {
        return await this.callGeminiAnalysis({
          title,
          description,
          providedCategory,
          address,
          ward,
        });
      } catch (err: any) {
        this.logger.warn(`Gemini API call failed or timed out (${err?.message}). Falling back to rule engine.`);
      }
    }

    // Transparent rule-based fallback
    return this.executeRuleBasedFallback(params);
  }

  private async callGeminiAnalysis(data: {
    title: string;
    description: string;
    providedCategory?: string;
    address?: string;
    ward?: string;
  }): Promise<AIAnalysisResult> {
    const prompt = `You are the CIVICMIND AI Incident Assessment Engine for municipal complaints.
Analyze the following citizen civic complaint and return ONLY a valid JSON object matching the exact specification:

Complaint Details:
- Title: ${data.title}
- Description: ${data.description}
- User Selected Category: ${data.providedCategory || 'Not specified'}
- Location: ${data.address || 'Unknown'} (${data.ward || 'General District'})

Rules:
1. Category must be one of: "roads_potholes", "water_sewage", "street_lighting", "sanitation_waste", "traffic_signals", "public_safety", "parks_trees", "other".
2. Summarize into 1 concise sentence (under 25 words).
3. Determine urgencyType: "immediate_hazard", "serious_damage", "public_health_risk", or "routine_maintenance".
4. Calculate priorityScore strictly between 0 and 100 based on public safety, infrastructure vulnerability, and transit disruption:
   - 0–24: LOW
   - 25–49: MEDIUM
   - 50–74: HIGH
   - 75–100: CRITICAL
5. Provide 2 to 4 transparent, plain-language reasons explaining WHY this score was assigned.
6. Extract 2 to 4 keywords/tags.
7. Estimated response/resolution hours (e.g. 4 for critical, 12 for high, 36 for medium, 72 for low).

JSON response format:
{
  "category": "roads_potholes",
  "categoryConfidence": 0.96,
  "summary": "Deep asphalt pothole causing immediate collision hazard near pedestrian crossing.",
  "urgencyType": "immediate_hazard",
  "priorityScore": 92,
  "priorityLevel": "CRITICAL",
  "priorityReasons": [
    "Severe risk of bicycle or vehicle tyre blowout in active transit lane",
    "Report mentions proximity to pedestrian crosswalk during commute hours"
  ],
  "extractedTags": ["Pothole", "Traffic Hazard", "School Zone"],
  "estimatedResolutionHours": 6
}`;

    const response = await this.genAI!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    const score = Math.max(0, Math.min(100, Math.round(parsed.priorityScore || 50)));
    let level: PriorityLevel = 'MEDIUM';
    if (score >= 75) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 25) level = 'MEDIUM';
    else level = 'LOW';

    return {
      category: parsed.category || data.providedCategory || 'other',
      categoryConfidence: Number(parsed.categoryConfidence || 0.92),
      summary: parsed.summary || `${data.title} requires municipal attention.`,
      urgencyType: parsed.urgencyType || 'routine_maintenance',
      priorityScore: score,
      priorityLevel: level,
      priorityReasons: Array.isArray(parsed.priorityReasons) && parsed.priorityReasons.length > 0 
        ? parsed.priorityReasons 
        : ['Assessed based on municipal safety criteria and reported location impact.'],
      extractedTags: Array.isArray(parsed.extractedTags) ? parsed.extractedTags : ['Civic Issue'],
      estimatedResolutionHours: Number(parsed.estimatedResolutionHours || 24),
      isFallback: false,
      modelUsed: 'gemini-2.5-flash',
    };
  }

  /**
   * Transparent, deterministic rule-based fallback engine
   * Evaluates semantic keywords, safety cues, and location sensitivity.
   */
  executeRuleBasedFallback(params: {
    title: string;
    description: string;
    providedCategory?: string;
    latitude: number;
    longitude: number;
    address?: string;
    ward?: string;
  }): AIAnalysisResult {
    const text = `${params.title} ${params.description} ${params.address || ''}`.toLowerCase();
    
    // Category detection rules
    let category = params.providedCategory || 'other';
    let categoryConfidence = 0.88;

    if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('crater') || text.includes('tarmac')) {
      category = 'roads_potholes';
      categoryConfidence = 0.97;
    } else if (text.includes('water') || text.includes('sewage') || text.includes('leak') || text.includes('pipe') || text.includes('drain') || text.includes('burst')) {
      category = 'water_sewage';
      categoryConfidence = 0.98;
    } else if (text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('blackout') || text.includes('pole')) {
      category = 'street_lighting';
      categoryConfidence = 0.96;
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('dump') || text.includes('bin') || text.includes('debris')) {
      category = 'sanitation_waste';
      categoryConfidence = 0.95;
    } else if (text.includes('signal') || text.includes('traffic') || text.includes('intersection') || text.includes('red light')) {
      category = 'traffic_signals';
      categoryConfidence = 0.96;
    }

    // Urgency & scoring factors
    const isLifeSafety = text.includes('hazard') || text.includes('danger') || text.includes('swerved') || 
                         text.includes('crash') || text.includes('injury') || text.includes('burst') || 
                         text.includes('deep crater') || text.includes('electric') || text.includes('exposed wire');

    const isInfrastructureFlooding = text.includes('flood') || text.includes('overflowing') || text.includes('submerged') || text.includes('water main');
    const isVulnerableZone = text.includes('school') || text.includes('hospital') || text.includes('elderly') || text.includes('transit') || text.includes('crosswalk');

    let baseScore = 52;
    const reasons: string[] = [];
    let urgencyType: AIAnalysisResult['urgencyType'] = 'routine_maintenance';

    if (isLifeSafety) {
      baseScore = 88;
      urgencyType = 'immediate_hazard';
      reasons.push('Elevated physical safety hazard detected from incident semantics');
    }

    if (isInfrastructureFlooding) {
      baseScore = Math.max(baseScore, 82);
      urgencyType = urgencyType === 'immediate_hazard' ? 'immediate_hazard' : 'serious_damage';
      reasons.push('Active liquid or pressure release risking progressive foundation or roadway damage');
    }

    if (isVulnerableZone) {
      baseScore += 6;
      reasons.push('Location indicates high pedestrian foot traffic, school corridor, or transit hub');
    }

    if (text.includes('night') || text.includes('darkness') || text.includes('blackout')) {
      baseScore += 5;
      reasons.push('Pedestrian safety risk heightened due to dark/nighttime visibility impairment');
    }

    if (text.includes('waste') || text.includes('garbage') || text.includes('stench')) {
      urgencyType = 'public_health_risk';
      reasons.push('Public health standard and hygiene impact identified');
    }

    if (reasons.length === 0) {
      reasons.push('Classified as standard municipal maintenance ticket');
      reasons.push('No immediate critical public safety threat detected in report text');
    }

    const priorityScore = Math.min(99, Math.max(15, baseScore));
    let priorityLevel: PriorityLevel = 'MEDIUM';
    if (priorityScore >= 75) priorityLevel = 'CRITICAL';
    else if (priorityScore >= 50) priorityLevel = 'HIGH';
    else if (priorityScore >= 25) priorityLevel = 'MEDIUM';
    else priorityLevel = 'LOW';

    const tags = [category.replace('_', ' ').toUpperCase()];
    if (isVulnerableZone) tags.push('Transit Zone');
    if (isLifeSafety) tags.push('Urgent Hazard');

    return {
      category,
      categoryConfidence,
      summary: `${params.title}: Incident identified in ${params.ward || 'the sector'} requiring ${urgencyType.replace('_', ' ')} attention.`,
      urgencyType,
      priorityScore,
      priorityLevel,
      priorityReasons: reasons,
      extractedTags: tags,
      estimatedResolutionHours: priorityLevel === 'CRITICAL' ? 6 : priorityLevel === 'HIGH' ? 18 : 48,
      isFallback: true,
      modelUsed: 'civicmind-rule-engine-fallback',
    };
  }

  /**
   * Calculates Haversine distance in meters between two coordinates.
   */
  calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Evaluates candidate complaints for duplicates based on:
   * 1. Category match
   * 2. Geographic distance (< 250 meters)
   * 3. Text/title similarity
   */
  evaluateDuplicateCandidates(
    newComplaint: { title: string; description: string; category: string; latitude: number; longitude: number },
    existingComplaints: Array<{ id: string; trackingId: string; title: string; description: string; category: string; latitude: number; longitude: number; createdAt: Date }>
  ): DuplicateMatchResult[] {
    const matches: DuplicateMatchResult[] = [];

    const newWords = new Set(
      `${newComplaint.title} ${newComplaint.description}`
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    for (const item of existingComplaints) {
      // Must be same category
      if (item.category !== newComplaint.category) continue;

      const distance = this.calculateDistanceMeters(
        newComplaint.latitude,
        newComplaint.longitude,
        item.latitude,
        item.longitude
      );

      // Within 300 meters is candidate distance
      if (distance > 300) continue;

      const itemWords = `${item.title} ${item.description}`
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

      let commonCount = 0;
      for (const w of itemWords) {
        if (newWords.has(w)) commonCount++;
      }

      const jaccard = itemWords.length > 0 ? (commonCount / (newWords.size + itemWords.length - commonCount)) : 0;
      const distanceFactor = Math.max(0, 1 - distance / 300); // 1 at 0m, 0 at 300m
      const similarityScore = Math.min(99, Math.round((jaccard * 0.6 + distanceFactor * 0.4) * 100));

      if (similarityScore >= 60 || distance <= 50) {
        matches.push({
          complaintId: item.id,
          trackingId: item.trackingId,
          similarityScore: Math.max(similarityScore, distance <= 40 ? 85 : 65),
          distanceMeters: distance,
          reason: `Located ${distance}m away with matching ${item.category} category and overlapping incident keywords.`,
          isSuspectedDuplicate: true,
        });
      }
    }

    return matches.sort((a, b) => b.similarityScore - a.similarityScore);
  }
}
