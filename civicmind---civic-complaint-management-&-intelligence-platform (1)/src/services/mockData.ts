import { Complaint, HotspotZone, AIActionBrief, AuthorityKPIs } from '../types';

// Realistic inline SVG thumbnails for civic infrastructure issues
export const SAMPLE_CIVIC_IMAGES = {
  pothole: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23334155"/><rect y="260" width="600" height="140" fill="%231e293b"/><path d="M140 280 Q210 240 320 270 T480 300 Q430 360 280 350 T140 280 Z" fill="%230f172a"/><path d="M180 290 Q240 270 310 285 T430 310 Q390 335 270 330 Z" fill="%23020617"/><circle cx="210" cy="285" r="4" fill="%2364748b"/><circle cx="260" cy="315" r="6" fill="%23475569"/><circle cx="370" cy="295" r="5" fill="%2364748b"/><line x1="0" y1="200" x2="600" y2="200" stroke="%23f59e0b" stroke-dasharray="24 16" stroke-width="6"/><rect x="20" y="20" width="130" height="28" rx="4" fill="%23000000" fill-opacity="0.6"/><text x="28" y="38" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="600">ROADS & PAVEMENT</text></svg>',
  
  streetlight: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect y="320" width="600" height="80" fill="%231e293b"/><line x1="220" y1="360" x2="220" y2="120" stroke="%23475569" stroke-width="14" stroke-linecap="round"/><path d="M220 120 Q240 60 300 70 L340 90" fill="none" stroke="%23475569" stroke-width="12" stroke-linecap="round"/><polygon points="320,90 360,95 345,120 310,115" fill="%2364748b"/><circle cx="335" cy="115" r="6" fill="%23ef4444"/><circle cx="335" cy="115" r="24" fill="%23ef4444" fill-opacity="0.15"/><rect x="20" y="20" width="130" height="28" rx="4" fill="%23000000" fill-opacity="0.6"/><text x="28" y="38" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="600">STREET LIGHTING</text></svg>',
  
  waterleak: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23475569"/><rect y="240" width="600" height="160" fill="%23334155"/><ellipse cx="300" cy="300" rx="220" ry="60" fill="%230284c7" fill-opacity="0.75"/><ellipse cx="300" cy="300" rx="160" ry="40" fill="%2338bdf8" fill-opacity="0.85"/><ellipse cx="300" cy="295" rx="70" ry="18" fill="%23e0f2fe"/><path d="M295 240 Q300 270 305 290" stroke="%23ffffff" stroke-width="4" stroke-linecap="round"/><circle cx="280" cy="280" r="10" fill="%23ffffff" fill-opacity="0.6"/><circle cx="320" cy="275" r="8" fill="%23ffffff" fill-opacity="0.6"/><rect x="20" y="20" width="140" height="28" rx="4" fill="%23000000" fill-opacity="0.6"/><text x="28" y="38" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="600">WATER INFRASTRUCTURE</text></svg>',
  
  waste: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2364748b"/><rect y="280" width="600" height="120" fill="%23475569"/><rect x="200" y="160" width="100" height="160" rx="6" fill="%23166534"/><rect x="190" y="150" width="120" height="16" rx="4" fill="%2314532d"/><rect x="320" y="180" width="90" height="140" rx="6" fill="%231e3a8a"/><polygon points="260,140 330,130 320,170 250,165" fill="%23e2e8f0"/><polygon points="170,270 230,285 210,330 150,300" fill="%23cbd5e1"/><polygon points="380,260 440,270 420,320 360,310" fill="%2394a3b8"/><rect x="20" y="20" width="130" height="28" rx="4" fill="%23000000" fill-opacity="0.6"/><text x="28" y="38" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="600">SANITATION & WASTE</text></svg>',

  traffic: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="260" y="60" width="80" height="220" rx="12" fill="%230f172a" stroke="%23334155" stroke-width="4"/><circle cx="300" cy="100" r="24" fill="%23ef4444" fill-opacity="0.9"/><circle cx="300" cy="170" r="24" fill="%23334155"/><circle cx="300" cy="240" r="24" fill="%23334155"/><line x1="300" y1="280" x2="300" y2="400" stroke="%23475569" stroke-width="16"/><rect x="20" y="20" width="130" height="28" rx="4" fill="%23000000" fill-opacity="0.6"/><text x="28" y="38" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="600">TRAFFIC & SIGNALS</text></svg>'
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c-8941',
    trackingNumber: 'CIV-2026-8941',
    title: 'Severe Caved-In Pothole Near Lincoln High Crosswalk',
    description: 'Deep road depression and broken tarmac expanding right at the school pedestrian crosswalk. Two cyclists have swerved into oncoming traffic to avoid it this morning.',
    category: 'roads_potholes',
    categoryLabel: 'Roads & Potholes',
    status: 'in_progress',
    priority: 'critical',
    location: {
      address: '742 Elmwood Ave at Lincoln Way',
      ward: 'Ward 4 - Metro Center',
      landmark: 'Opposite Lincoln High School East Gate',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      city: 'San Francisco Metro'
    },
    imageUrl: SAMPLE_CIVIC_IMAGES.pothole,
    reportedBy: {
      name: 'Elena Rostova',
      email: 'elena.rostova@example.org',
      phone: '+1 (555) 234-8901',
      isAnonymous: false
    },
    createdAt: '2026-10-28T08:15:00Z',
    updatedAt: '2026-10-29T14:20:00Z',
    assignedDepartment: 'Department of Public Works - Asphalt Rapid Crew',
    assignedOfficer: 'Supervisor Marcus Vance',
    aiAnalysis: {
      categoryConfidence: 0.98,
      sentimentScore: 'urgent',
      priorityScore: 94,
      priorityLevel: 'critical',
      priorityReasons: [
        'Direct collision risk in active school speed zone during peak commute',
        'Vulnerability to heavy rain forecast within next 24 hours',
        '3 corroborating citizen reports clustered within 40m radius',
        'Cyclist safety hazard with zero shoulder clearance'
      ],
      extractedTags: ['School Zone', 'Asphalt Cavity', 'Cyclist Risk', 'Immediate Hazard'],
      summary: 'High-severity road failure directly impacting student pedestrian crossing. Immediate asphalt patch crew required.',
      estimatedResolutionHours: 6,
      hazardRisk: 'critical'
    },
    duplicateCandidates: [
      {
        complaintId: 'c-8949',
        trackingNumber: 'CIV-2026-8949',
        title: 'Huge hole in pavement outside Lincoln High',
        distanceMeters: 18,
        similarityScore: 92,
        reportedAt: '2026-10-28T09:40:00Z',
        status: 'under_review'
      },
      {
        complaintId: 'c-8962',
        trackingNumber: 'CIV-2026-8962',
        title: 'Bicycle tire popped on deep crater Lincoln & Elmwood',
        distanceMeters: 32,
        similarityScore: 88,
        reportedAt: '2026-10-28T11:15:00Z',
        status: 'under_review'
      }
    ],
    mergedCount: 2,
    timeline: [
      {
        id: 't-1',
        status: 'submitted',
        timestamp: '2026-10-28T08:15:00Z',
        actor: 'Elena Rostova',
        actorRole: 'citizen',
        note: 'Complaint submitted with geolocation and photo attachment.'
      },
      {
        id: 't-2',
        status: 'under_review',
        timestamp: '2026-10-28T08:16:12Z',
        actor: 'CivicMind AI Triage Engine',
        actorRole: 'ai_system',
        note: 'AI classified as Roads & Potholes (98% confidence). Urgency calculated at 94/100 due to proximity to School Zone.'
      },
      {
        id: 't-3',
        status: 'assigned',
        timestamp: '2026-10-28T08:45:00Z',
        actor: 'Chief Dispatcher Kowalski',
        actorRole: 'dispatcher',
        note: 'Escalated to Public Works Rapid Asphalt Unit. Supervisor Marcus Vance assigned.'
      },
      {
        id: 't-4',
        status: 'in_progress',
        timestamp: '2026-10-29T14:20:00Z',
        actor: 'Supervisor Marcus Vance',
        actorRole: 'field_crew',
        note: 'Field crew arrived on site. Safety cones deployed. Sub-base compaction and cold mix laying in progress.'
      }
    ]
  },
  {
    id: 'c-8922',
    trackingNumber: 'CIV-2026-8922',
    title: 'High Pressure Water Main Leak Flooding Pedestrian Walkway',
    description: 'Clean drinking water is bursting from underneath the concrete pavement slab. Water volume has doubled over 3 hours, submerging the sidewalk and entering storefront entries.',
    category: 'water_sewage',
    categoryLabel: 'Water & Sewage',
    status: 'assigned',
    priority: 'critical',
    location: {
      address: '318 Market Promenade',
      ward: 'Ward 2 - Commercial Harbor',
      landmark: 'In front of Old Harbor Bakery',
      coordinates: { lat: 37.7915, lng: -122.3998 },
      city: 'San Francisco Metro'
    },
    imageUrl: SAMPLE_CIVIC_IMAGES.waterleak,
    reportedBy: {
      name: 'David Chen',
      email: 'd.chen@bakeryco.demo',
      phone: '+1 (555) 789-1122',
      isAnonymous: false
    },
    createdAt: '2026-10-29T06:30:00Z',
    updatedAt: '2026-10-29T07:10:00Z',
    assignedDepartment: 'Municipal Water & Sewer Authority',
    assignedOfficer: 'Lead Tech Samantha Ortiz',
    aiAnalysis: {
      categoryConfidence: 0.99,
      sentimentScore: 'urgent',
      priorityScore: 91,
      priorityLevel: 'critical',
      priorityReasons: [
        'Active potable water resource wastage estimated >120 gallons/minute',
        'Storefront foundation flooding risk',
        'Hydrostatic pressure may destabilize adjoining curb structure'
      ],
      extractedTags: ['Water Main', 'Flooding', 'Commercial District', 'Asset Loss'],
      summary: 'Sub-pavement water main rupture with ongoing surface flooding. Valve shutdown protocol initiated.',
      estimatedResolutionHours: 8,
      hazardRisk: 'critical'
    },
    duplicateCandidates: [],
    timeline: [
      {
        id: 't-10',
        status: 'submitted',
        timestamp: '2026-10-29T06:30:00Z',
        actor: 'David Chen',
        actorRole: 'citizen',
        note: 'Reported with video and exact address.'
      },
      {
        id: 't-11',
        status: 'under_review',
        timestamp: '2026-10-29T06:31:05Z',
        actor: 'CivicMind AI Triage Engine',
        actorRole: 'ai_system',
        note: 'AI detected severe infrastructure flooding. Emergency score 91/100.'
      },
      {
        id: 't-12',
        status: 'assigned',
        timestamp: '2026-10-29T07:10:00Z',
        actor: 'Automated Emergency Dispatch',
        actorRole: 'dispatcher',
        note: 'Dispatched to Municipal Water Authority emergency pipeline squad.'
      }
    ]
  },
  {
    id: 'c-8890',
    trackingNumber: 'CIV-2026-8890',
    title: 'Cluster of 4 Streetlights Non-Operational Along Park Pathway',
    description: 'Four consecutive solar/grid streetlights have been completely dark for three consecutive nights. The path connects residential apartments to the commuter rail station.',
    category: 'street_lighting',
    categoryLabel: 'Street Lighting',
    status: 'under_review',
    priority: 'high',
    location: {
      address: 'Pineview Greenway Trail, Post 14 to 18',
      ward: 'Ward 7 - South Heights',
      landmark: 'Near Pineview Community Garden',
      coordinates: { lat: 37.7523, lng: -122.4412 },
      city: 'San Francisco Metro'
    },
    imageUrl: SAMPLE_CIVIC_IMAGES.streetlight,
    reportedBy: {
      name: 'Maya Patel',
      email: 'maya.p@civiccitizen.demo',
      phone: '+1 (555) 345-6789',
      isAnonymous: false
    },
    createdAt: '2026-10-29T19:45:00Z',
    updatedAt: '2026-10-29T19:50:00Z',
    assignedDepartment: 'Division of Electrical & Street Infrastructure',
    aiAnalysis: {
      categoryConfidence: 0.96,
      sentimentScore: 'frustrated',
      priorityScore: 78,
      priorityLevel: 'high',
      priorityReasons: [
        'Total blackout along critical evening pedestrian transit connector',
        'Heightened public safety vulnerability reported by night commuters',
        'Multi-fixture failure suggests breaker or circuit feed defect rather than single bulb burnout'
      ],
      extractedTags: ['Blackout', 'Transit Route', 'Electrical Grid', 'Public Safety'],
      summary: 'Consecutive multi-light electrical circuit outage on public transit connector pathway.',
      estimatedResolutionHours: 24,
      hazardRisk: 'moderate'
    },
    duplicateCandidates: [
      {
        complaintId: 'c-8894',
        trackingNumber: 'CIV-2026-8894',
        title: 'Dark walking trail behind South Heights Station',
        distanceMeters: 45,
        similarityScore: 84,
        reportedAt: '2026-10-29T21:10:00Z',
        status: 'under_review'
      }
    ],
    timeline: [
      {
        id: 't-20',
        status: 'submitted',
        timestamp: '2026-10-29T19:45:00Z',
        actor: 'Maya Patel',
        actorRole: 'citizen',
        note: 'Submitted via CivicMind mobile web app.'
      },
      {
        id: 't-21',
        status: 'under_review',
        timestamp: '2026-10-29T19:50:00Z',
        actor: 'CivicMind AI Triage Engine',
        actorRole: 'ai_system',
        note: 'Triage complete. Circuit level anomaly detected. Priority marked High (78/100).'
      }
    ]
  },
  {
    id: 'c-8854',
    trackingNumber: 'CIV-2026-8854',
    title: 'Repeated Illegal Commercial Waste Dumping at Alley Entrance',
    description: 'Bulk construction debris, broken drywall, paint buckets, and commercial packaging dumped blocking pedestrian alley and stormwater drain intake.',
    category: 'sanitation_waste',
    categoryLabel: 'Sanitation & Waste',
    status: 'resolved',
    priority: 'medium',
    location: {
      address: 'Alley 14, off Cypress & 8th St',
      ward: 'Ward 3 - East District',
      landmark: 'Behind Cypress Hardware Warehouse',
      coordinates: { lat: 37.7681, lng: -122.4082 },
      city: 'San Francisco Metro'
    },
    imageUrl: SAMPLE_CIVIC_IMAGES.waste,
    reportedBy: {
      name: 'Carlos Mendez',
      email: 'carlos.m@example.org',
      isAnonymous: false
    },
    createdAt: '2026-10-26T10:00:00Z',
    updatedAt: '2026-10-27T16:30:00Z',
    assignedDepartment: 'Bureau of Sanitation & Code Enforcement',
    assignedOfficer: 'Inspector Tyler Ross',
    aiAnalysis: {
      categoryConfidence: 0.95,
      sentimentScore: 'neutral',
      priorityScore: 62,
      priorityLevel: 'medium',
      priorityReasons: [
        'Drainage blockage risk before upcoming precipitation',
        'Potential hazardous material (unsealed paint containers)',
        'Code enforcement violation for unregistered commercial dumping'
      ],
      extractedTags: ['Illegal Dumping', 'Drainage Obstruction', 'Construction Debris'],
      summary: 'Commercial waste obstruction cleared and license plate surveillance reviewed.',
      estimatedResolutionHours: 24,
      hazardRisk: 'moderate'
    },
    duplicateCandidates: [],
    timeline: [
      {
        id: 't-30',
        status: 'submitted',
        timestamp: '2026-10-26T10:00:00Z',
        actor: 'Carlos Mendez',
        actorRole: 'citizen',
        note: 'Complaint filed.'
      },
      {
        id: 't-31',
        status: 'assigned',
        timestamp: '2026-10-26T11:30:00Z',
        actor: 'Bureau Dispatch',
        actorRole: 'dispatcher',
        note: 'Assigned to Inspector Tyler Ross and Heavy Sanitation Truck #14.'
      },
      {
        id: 't-32',
        status: 'in_progress',
        timestamp: '2026-10-27T09:00:00Z',
        actor: 'Inspector Tyler Ross',
        actorRole: 'field_crew',
        note: 'Clearance underway. Code enforcement citation documented.'
      },
      {
        id: 't-33',
        status: 'resolved',
        timestamp: '2026-10-27T16:30:00Z',
        actor: 'Inspector Tyler Ross',
        actorRole: 'field_crew',
        note: 'Alleyway 100% cleared. Storm drain grate inspected and unobstructed. Citizen notified.'
      }
    ]
  },
  {
    id: 'c-8810',
    trackingNumber: 'CIV-2026-8810',
    title: 'Traffic Signal Desynchronization & Stuck Red Cycle at Junction',
    description: 'Eastbound traffic signal on Grand Blvd is trapped in a 5-minute red hold cycle, causing gridlock backed up across 4 intersections during peak morning rush.',
    category: 'traffic_signals',
    categoryLabel: 'Traffic & Signals',
    status: 'in_progress',
    priority: 'high',
    location: {
      address: 'Grand Blvd & Lexington Ave Intersection',
      ward: 'Ward 4 - Metro Center',
      landmark: 'Grand Metro Interchange',
      coordinates: { lat: 37.7821, lng: -122.4111 },
      city: 'San Francisco Metro'
    },
    imageUrl: SAMPLE_CIVIC_IMAGES.traffic,
    reportedBy: {
      name: 'Anonymous Citizen',
      isAnonymous: true
    },
    createdAt: '2026-10-29T07:45:00Z',
    updatedAt: '2026-10-29T08:15:00Z',
    assignedDepartment: 'Department of Transportation - Traffic Signal Operations',
    assignedOfficer: 'Traffic Engineer Rachel Thorne',
    aiAnalysis: {
      categoryConfidence: 0.97,
      sentimentScore: 'urgent',
      priorityScore: 86,
      priorityLevel: 'high',
      priorityReasons: [
        'Significant vehicular transit disruption across 4 connected intersections',
        'Emergency response vehicles delayed through central arterial corridor',
        'High risk of intersection gridlock collision from driver impatience'
      ],
      extractedTags: ['Signal Fault', 'Traffic Jam', 'Emergency Corridor'],
      summary: 'Signal controller hardware timer lockup affecting arterial traffic flow.',
      estimatedResolutionHours: 3,
      hazardRisk: 'critical'
    },
    duplicateCandidates: [],
    timeline: [
      {
        id: 't-40',
        status: 'submitted',
        timestamp: '2026-10-29T07:45:00Z',
        actor: 'Anonymous Citizen',
        actorRole: 'citizen',
        note: 'Anonymous alert received.'
      },
      {
        id: 't-41',
        status: 'assigned',
        timestamp: '2026-10-29T08:00:00Z',
        actor: 'AI Auto-Routing',
        actorRole: 'ai_system',
        note: 'Routed to DOT Traffic Control Center based on real-time traffic corridor priority.'
      },
      {
        id: 't-42',
        status: 'in_progress',
        timestamp: '2026-10-29T08:15:00Z',
        actor: 'Rachel Thorne',
        actorRole: 'dispatcher',
        note: 'Remote loop controller reset triggered. Field technician en route for optical sensor test.'
      }
    ]
  }
];

export const INITIAL_KPIS: AuthorityKPIs = {
  totalComplaints: 1482,
  activeComplaints: 47,
  criticalUrgentCount: 6,
  resolvedTodayCount: 23,
  avgResolutionTimeHours: 4.8,
  duplicateClusteringRate: 36.4,
  aiTriageAccuracy: 95.8,
  satisfactionRate: 91.2
};

export const HOTSPOT_ZONES: HotspotZone[] = [
  {
    id: 'zone-w4',
    ward: 'Ward 4',
    name: 'Metro Center & Transit Hub',
    activeIncidents: 19,
    dominantCategory: 'Roads & Potholes',
    riskLevel: 'high',
    coordinates: { lat: 37.779, lng: -122.418 },
    changeWeekOverWeek: 18.5
  },
  {
    id: 'zone-w2',
    ward: 'Ward 2',
    name: 'Commercial Harbor & Pierfront',
    activeIncidents: 12,
    dominantCategory: 'Water & Sewage',
    riskLevel: 'high',
    coordinates: { lat: 37.792, lng: -122.398 },
    changeWeekOverWeek: 6.2
  },
  {
    id: 'zone-w7',
    ward: 'Ward 7',
    name: 'South Heights Greenway',
    activeIncidents: 8,
    dominantCategory: 'Street Lighting',
    riskLevel: 'medium',
    coordinates: { lat: 37.753, lng: -122.440 },
    changeWeekOverWeek: -4.1
  },
  {
    id: 'zone-w3',
    ward: 'Ward 3',
    name: 'East District & Industrial',
    activeIncidents: 5,
    dominantCategory: 'Sanitation & Waste',
    riskLevel: 'low',
    coordinates: { lat: 37.765, lng: -122.405 },
    changeWeekOverWeek: -12.0
  },
  {
    id: 'zone-w5',
    ward: 'Ward 5',
    name: 'Northgate Residential',
    activeIncidents: 3,
    dominantCategory: 'Parks & Trees',
    riskLevel: 'low',
    coordinates: { lat: 37.801, lng: -122.428 },
    changeWeekOverWeek: 0.0
  }
];

export const AI_ACTION_BRIEFS: AIActionBrief[] = [
  {
    id: 'brief-01',
    title: 'Ward 4 Road Pavement Deterioration Cluster',
    zone: 'Ward 4 - Metro Center (Lincoln & Elmwood Corridor)',
    category: 'Roads & Infrastructure',
    severity: 'urgent',
    timestamp: 'Generated today at 08:30 AM',
    situation: 'CivicMind intelligence has merged 5 separate complaint reports into 2 primary incident clusters within a 120-meter corridor. High vehicle counts combined with school pedestrian traffic indicate severe pothole expansion if left unpaved prior to Thursday rainfall.',
    recommendedAction: 'Dispatch Rapid Asphalt Unit 3 for unified corridor resurfacing rather than single-patch repair. Coordinate off-peak closure with transit police.',
    impactMetrics: 'Est. cost saving: $4,200 via batched repair. Eliminates collision hazard for ~1,800 daily school commuters.',
    affectedComplaintsCount: 5
  },
  {
    id: 'brief-02',
    title: 'Ward 7 South Trail Lighting Circuit Anomaly',
    zone: 'Ward 7 - South Heights Greenway',
    category: 'Electrical & Lighting',
    severity: 'urgent',
    timestamp: 'Generated today at 07:15 AM',
    situation: 'Consecutive streetlight outages reported over 3 days along 280 meters of the primary commuter footpath. Pattern analysis confirms a main feeder breaker trip rather than individual lamp wear.',
    recommendedAction: 'Deploy high-voltage electrical crew to inspect substation feed junction J-14. Reset and replace worn weather seal.',
    impactMetrics: 'Restores continuous safety illumination for 350+ nightly pedestrian transit commuters.',
    affectedComplaintsCount: 4
  },
  {
    id: 'brief-03',
    title: 'Seasonal Stormwater Grate Sediment Risk Ahead of Storm',
    zone: 'Ward 3 & Ward 2 Low-Lying Drainage Basins',
    category: 'Water & Flood Prevention',
    severity: 'advisory',
    timestamp: 'Generated yesterday at 04:45 PM',
    situation: 'Aggregated citizen reports and street sweeper logs indicate high organic leaf debris concentration clogging 8 storm drain basins along the lower harbor perimeter.',
    recommendedAction: 'Schedule proactive vacuum truck sweeps before forecasted Friday 25mm rain event to prevent street pooling.',
    impactMetrics: 'Mitigates localized flash-flooding across 14 commercial store basements.',
    affectedComplaintsCount: 8
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  roads_potholes: 'Roads & Potholes',
  street_lighting: 'Street Lighting',
  water_sewage: 'Water & Sewage',
  sanitation_waste: 'Sanitation & Waste',
  traffic_signals: 'Traffic & Signals',
  public_safety: 'Public Safety',
  parks_trees: 'Parks & Trees',
  other: 'Other Civic Concern'
};
