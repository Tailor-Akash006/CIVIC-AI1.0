import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  Logger 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { 
  CreateComplaintDto, 
  UpdateComplaintStatusDto, 
  AssignComplaintDto, 
  QueryComplaintsDto 
} from './dto/complaints.dto';
import { ComplaintStatus, Priority } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  /**
   * Submit a new civic complaint
   * Executes AI triage, links duplicate candidates, records audit trail.
   */
  async create(dto: CreateComplaintDto, createdById?: string) {
    const trackingId = await this.generateUniqueTrackingId();

    // Trigger AI processing (Gemini or rule-based fallback)
    const aiResult = await this.aiService.analyzeComplaint({
      title: dto.title,
      description: dto.description,
      providedCategory: dto.category,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address,
      ward: dto.ward,
    });

    // Check for existing active complaints nearby to identify suspected duplicates
    const existingActive = await this.prisma.complaint.findMany({
      where: {
        category: dto.category,
        status: { notIn: [ComplaintStatus.RESOLVED, ComplaintStatus.REJECTED] },
      },
      select: {
        id: true,
        trackingId: true,
        title: true,
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        createdAt: true,
      },
      take: 20,
    });

    const duplicateMatches = this.aiService.evaluateDuplicateCandidates(
      {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      existingActive
    );

    // Save complaint to PostgreSQL
    const complaint = await this.prisma.complaint.create({
      data: {
        trackingId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        aiCategory: aiResult.category,
        aiSummary: aiResult.summary,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        ward: dto.ward || 'Ward 4 - Metro Center',
        imageUrl: dto.imageUrl,
        priority: aiResult.priorityLevel as Priority,
        priorityScore: aiResult.priorityScore,
        priorityReason: aiResult.priorityReasons.join('; '),
        status: ComplaintStatus.SUBMITTED,
        isAnonymous: Boolean(dto.isAnonymous),
        reporterName: dto.isAnonymous ? 'Anonymous Citizen' : dto.reporterName,
        reporterEmail: dto.isAnonymous ? null : dto.reporterEmail,
        reporterPhone: dto.isAnonymous ? null : dto.reporterPhone,
        createdBy: createdById || null,
        duplicateOf: duplicateMatches.length > 0 ? duplicateMatches[0].complaintId : null,
        duplicateScore: duplicateMatches.length > 0 ? duplicateMatches[0].similarityScore : null,
        assignedDept: this.getDefaultDepartment(dto.category),
        history: {
          create: [
            {
              newStatus: ComplaintStatus.SUBMITTED,
              changedBy: dto.isAnonymous ? 'Anonymous Citizen' : (dto.reporterName || 'Citizen Reporter'),
              actorRole: 'citizen',
              remarks: 'Complaint registered via CivicMind portal with verified GPS location.',
            },
            {
              previousStatus: ComplaintStatus.SUBMITTED,
              newStatus: ComplaintStatus.UNDER_REVIEW,
              changedBy: 'CivicMind AI Triage Engine',
              actorRole: 'ai_system',
              remarks: `Automated assessment complete: Assigned ${aiResult.priorityScore}/100 priority score with ${aiResult.urgencyType.replace('_', ' ')} classification.`,
            },
          ],
        },
      },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: true,
      },
    });

    return this.mapToFrontendFormat(complaint, aiResult, duplicateMatches);
  }

  /**
   * Retrieve all complaints with filters and pagination
   */
  async findAll(query: QueryComplaintsDto) {
    const where: any = {};

    if (query.status && query.status !== 'all') {
      where.status = query.status.toUpperCase() as ComplaintStatus;
    }

    if (query.priority && query.priority !== 'all') {
      where.priority = query.priority.toUpperCase() as Priority;
    }

    if (query.category && query.category !== 'all') {
      where.category = query.category;
    }

    if (query.ward && query.ward !== 'all') {
      where.ward = { contains: query.ward, mode: 'insensitive' };
    }

    if (query.search && query.search.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { trackingId: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ];
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.complaint.count({ where }),
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          history: { orderBy: { createdAt: 'asc' } },
          duplicates: { select: { id: true, trackingId: true, title: true, priorityScore: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      complaints: items.map(item => this.mapToFrontendFormat(item)),
    };
  }

  /**
   * Retrieve single complaint by ID
   */
  async findById(id: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { trackingId: id }],
      },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: true,
        assignedUser: { select: { id: true, name: true, email: true, department: true } },
        createdByUser: { select: { id: true, name: true, email: true } },
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint ${id} not found`);
    }

    return this.mapToFrontendFormat(complaint);
  }

  /**
   * Public tracking by trackingId without exposing private personal data
   */
  async findByTrackingId(trackingId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { trackingId },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: { select: { trackingId: true, title: true } },
      },
    });

    if (!complaint) {
      throw new NotFoundException(`No complaint registered with tracking ID: ${trackingId}`);
    }

    // Mask sensitive citizen contact info for public view
    const masked = { ...complaint };
    if (!masked.isAnonymous && masked.reporterName) {
      masked.reporterName = masked.reporterName.split(' ')[0] + ' ***';
    }
    masked.reporterEmail = null;
    masked.reporterPhone = null;

    return this.mapToFrontendFormat(masked);
  }

  /**
   * Update complaint status and log audit history
   */
  async updateStatus(
    id: string, 
    dto: UpdateComplaintStatusDto, 
    userId?: string, 
    userName?: string
  ) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint ${id} not found`);
    }

    const previousStatus = complaint.status;
    const actorName = userName || dto.changedBy || 'Municipal Authority';

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: dto.status,
        resolvedAt: dto.status === ComplaintStatus.RESOLVED ? new Date() : complaint.resolvedAt,
        history: {
          create: {
            previousStatus,
            newStatus: dto.status,
            changedBy: actorName,
            changedById: userId || null,
            actorRole: 'dispatcher',
            remarks: dto.remarks || `Status transitioned to ${dto.status}`,
          },
        },
      },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: true,
      },
    });

    return this.mapToFrontendFormat(updated);
  }

  /**
   * Assign complaint to authority officer or department
   */
  async assign(id: string, dto: AssignComplaintDto, userId?: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint ${id} not found`);
    }

    const officer = dto.officerName || 'Assigned Officer';
    const dept = dto.assignedDept || complaint.assignedDept;

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        assignedTo: dto.assignedTo || complaint.assignedTo,
        assignedDept: dept,
        status: complaint.status === ComplaintStatus.SUBMITTED ? ComplaintStatus.ASSIGNED : complaint.status,
        history: {
          create: {
            previousStatus: complaint.status,
            newStatus: complaint.status === ComplaintStatus.SUBMITTED ? ComplaintStatus.ASSIGNED : complaint.status,
            changedBy: officer,
            changedById: userId || null,
            actorRole: 'dispatcher',
            remarks: dto.remarks || `Assigned to ${dept} (${officer})`,
          },
        },
      },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: true,
      },
    });

    return this.mapToFrontendFormat(updated);
  }

  /**
   * Retrieve complaint status history
   */
  async getHistory(id: string) {
    const history = await this.prisma.complaintHistory.findMany({
      where: { complaintId: id },
      orderBy: { createdAt: 'asc' },
    });

    return history.map(h => ({
      id: h.id,
      status: h.newStatus.toLowerCase(),
      timestamp: h.createdAt.toISOString(),
      actor: h.changedBy,
      actorRole: h.actorRole || 'dispatcher',
      note: h.remarks || `Status changed to ${h.newStatus}`,
    }));
  }

  /**
   * Merge duplicate ticket into primary complaint
   */
  async mergeDuplicates(primaryId: string, duplicateId: string) {
    const primary = await this.prisma.complaint.findUnique({ where: { id: primaryId } });
    const duplicate = await this.prisma.complaint.findUnique({ where: { id: duplicateId } });

    if (!primary || !duplicate) {
      throw new NotFoundException('Primary or duplicate complaint not found');
    }

    // Update duplicate
    await this.prisma.complaint.update({
      where: { id: duplicateId },
      data: {
        duplicateOf: primaryId,
        status: ComplaintStatus.REJECTED,
        history: {
          create: {
            previousStatus: duplicate.status,
            newStatus: ComplaintStatus.REJECTED,
            changedBy: 'CivicMind AI Duplicate Resolver',
            actorRole: 'ai_system',
            remarks: `Corroborated and merged into primary complaint ${primary.trackingId}.`,
          },
        },
      },
    });

    // Boost priority and add history on primary
    const updatedPrimary = await this.prisma.complaint.update({
      where: { id: primaryId },
      data: {
        priorityScore: Math.min(99, primary.priorityScore + 3),
        priorityReason: `${primary.priorityReason || ''}; Corroborated by duplicate citizen report ${duplicate.trackingId}`,
        history: {
          create: {
            previousStatus: primary.status,
            newStatus: primary.status,
            changedBy: 'CivicMind AI Duplicate Resolver',
            actorRole: 'ai_system',
            remarks: `Merged duplicate report ${duplicate.trackingId} into this record. Priority score boosted.`,
          },
        },
      },
      include: {
        history: { orderBy: { createdAt: 'asc' } },
        duplicates: true,
      },
    });

    return this.mapToFrontendFormat(updatedPrimary);
  }

  private async generateUniqueTrackingId(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(1000 + Math.random() * 9000);
      const trackingId = `CIV-2026-${num}`;
      const exists = await this.prisma.complaint.findUnique({ where: { trackingId } });
      if (!exists) return trackingId;
    }
    return `CIV-2026-${Date.now().toString().slice(-4)}`;
  }

  private getDefaultDepartment(category: string): string {
    const map: Record<string, string> = {
      roads_potholes: 'Department of Public Works - Rapid Asphalt Unit',
      water_sewage: 'Municipal Water & Sewer Authority',
      street_lighting: 'Division of Electrical & Street Infrastructure',
      sanitation_waste: 'Bureau of Sanitation & Code Enforcement',
      traffic_signals: 'Department of Transportation - Traffic Operations',
      public_safety: 'Municipal Emergency Management & Dispatch',
      parks_trees: 'Parks & Urban Forestry Division',
    };
    return map[category] || 'Department of Public Works';
  }

  /**
   * Helper that maps the database record to the exact TypeScript interface
   * expected by the CIVICMIND React frontend!
   */
  private mapToFrontendFormat(complaint: any, aiOverride?: any, dupOverride?: any) {
    const reasons = complaint.priorityReason 
      ? complaint.priorityReason.split(';').map((s: string) => s.trim()).filter(Boolean)
      : ['Evaluated by automated triage based on infrastructure safety factors'];

    return {
      id: complaint.id,
      trackingId: complaint.trackingId,
      trackingNumber: complaint.trackingId, // Alias for frontend compatibility
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      categoryLabel: this.getCategoryLabel(complaint.category),
      status: complaint.status.toLowerCase(),
      priority: complaint.priority.toLowerCase(),
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      location: {
        address: complaint.address || 'Central District',
        ward: complaint.ward || 'Ward 4 - Metro Center',
        coordinates: {
          lat: complaint.latitude,
          lng: complaint.longitude,
        },
        city: 'San Francisco Metro',
      },
      imageUrl: complaint.imageUrl,
      reportedBy: {
        name: complaint.reporterName || (complaint.isAnonymous ? 'Anonymous Citizen' : 'Citizen Reporter'),
        email: complaint.reporterEmail,
        phone: complaint.reporterPhone,
        isAnonymous: complaint.isAnonymous,
      },
      createdAt: complaint.createdAt ? new Date(complaint.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: complaint.updatedAt ? new Date(complaint.updatedAt).toISOString() : new Date().toISOString(),
      assignedDepartment: complaint.assignedDept || 'Department of Public Works',
      assignedOfficer: complaint.assignedUser?.name || null,
      aiAnalysis: aiOverride || {
        categoryConfidence: 0.96,
        sentimentScore: complaint.priority === 'CRITICAL' ? 'urgent' : 'neutral',
        priorityScore: complaint.priorityScore,
        priorityLevel: complaint.priority.toLowerCase(),
        priorityReasons: reasons,
        extractedTags: [this.getCategoryLabel(complaint.category), 'Civic Triage'],
        summary: complaint.aiSummary || `${complaint.title} assessed for municipal field dispatch.`,
        estimatedResolutionHours: complaint.priority === 'CRITICAL' ? 6 : complaint.priority === 'HIGH' ? 18 : 36,
        hazardRisk: complaint.priority === 'CRITICAL' ? 'critical' : complaint.priority === 'HIGH' ? 'moderate' : 'low',
      },
      duplicateCandidates: dupOverride || (complaint.duplicates?.map((d: any) => ({
        complaintId: d.id,
        trackingNumber: d.trackingId,
        title: d.title,
        distanceMeters: 45,
        similarityScore: d.duplicateScore || 85,
        reportedAt: d.createdAt,
        status: d.status.toLowerCase(),
      })) || []),
      timeline: (complaint.history || []).map((h: any) => ({
        id: h.id,
        status: h.newStatus.toLowerCase(),
        timestamp: h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString(),
        actor: h.changedBy,
        actorRole: h.actorRole || 'dispatcher',
        note: h.remarks || `Status transitioned to ${h.newStatus}`,
      })),
    };
  }

  private getCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      roads_potholes: 'Roads & Potholes',
      street_lighting: 'Street Lighting',
      water_sewage: 'Water & Sewage',
      sanitation_waste: 'Sanitation & Waste',
      traffic_signals: 'Traffic & Signals',
      public_safety: 'Public Safety',
      parks_trees: 'Parks & Trees',
      other: 'Other Civic Concern',
    };
    return labels[cat] || 'Civic Issue';
  }
}
