import { PrismaClient, Role, Priority, ComplaintStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CIVICMIND database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.complaintHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.authority.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 2. Seed Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('CivicMind2026!', salt);

  const citizenUser = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'citizen@civicmind.demo',
      passwordHash,
      role: Role.CITIZEN,
      phone: '+1 (555) 234-8901',
    },
  });

  const authorityUser = await prisma.user.create({
    data: {
      name: 'Supervisor Marcus Vance',
      email: 'authority@civicmind.demo',
      passwordHash,
      role: Role.AUTHORITY,
      department: 'Department of Public Works - Asphalt Rapid Crew',
      phone: '+1 (555) 345-6789',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Commissioner Walter Kowalski',
      email: 'admin@civicmind.demo',
      passwordHash,
      role: Role.ADMIN,
      department: 'Municipal Operations & City CAD Dispatch',
      phone: '+1 (555) 999-0001',
    },
  });

  console.log('👤 Created demo users (citizen, authority, admin).');

  // 3. Seed Authorities / Departments
  const departments = [
    { name: 'Public Works Rapid Asphalt Squad', department: 'Roads & Infrastructure', email: 'asphalt@civicmind.gov' },
    { name: 'Municipal Water & Sewer Authority', department: 'Water & Utilities', email: 'water@civicmind.gov' },
    { name: 'Division of Electrical & Street Infrastructure', department: 'Electrical Grid', email: 'lighting@civicmind.gov' },
    { name: 'Bureau of Sanitation & Code Enforcement', department: 'Sanitation', email: 'sanitation@civicmind.gov' },
    { name: 'DOT Traffic Signal Operations', department: 'Transportation', email: 'signals@civicmind.gov' },
  ];

  for (const dept of departments) {
    await prisma.authority.create({ data: dept });
  }

  console.log('🏛️ Created municipal authority departments.');

  // 4. Seed Synthetic Complaints (>40 records) with clusters & deliberate duplicates
  const complaintsData = [
    // --- Cluster 1: Ward 4 (Metro Center & Lincoln Way) - Roads & Traffic Hotspot ---
    {
      trackingId: 'CIV-2026-8941',
      title: 'Severe Caved-In Pothole Near Lincoln High Crosswalk',
      description: 'Deep road cavity expanding right at the pedestrian crosswalk. Two cyclists swerved into oncoming traffic to avoid it this morning.',
      category: 'roads_potholes',
      aiCategory: 'roads_potholes',
      aiSummary: 'High-severity road failure directly impacting student pedestrian crossing. Immediate asphalt patch crew required.',
      latitude: 37.7749,
      longitude: -122.4194,
      address: '742 Elmwood Ave at Lincoln Way',
      ward: 'Ward 4 - Metro Center',
      priority: Priority.CRITICAL,
      priorityScore: 94,
      priorityReason: 'Collision risk in active school speed zone; heavy rain forecast within next 24 hours; cyclist safety hazard',
      status: ComplaintStatus.IN_PROGRESS,
      assignedDept: 'Department of Public Works - Asphalt Rapid Crew',
      assignedTo: authorityUser.id,
      createdBy: citizenUser.id,
      reporterName: 'Elena Rostova',
      reporterEmail: 'elena@example.org',
    },
    {
      // Deliberate duplicate 1 of CIV-2026-8941
      trackingId: 'CIV-2026-8949',
      title: 'Huge hole in pavement outside Lincoln High East Gate',
      description: 'Massive crater in asphalt right where students cross Elmwood Ave. Danger of tripping or tyre puncture.',
      category: 'roads_potholes',
      aiCategory: 'roads_potholes',
      aiSummary: 'Corroborating report of asphalt cavity at Lincoln High East Gate.',
      latitude: 37.7751,
      longitude: -122.4192,
      address: '750 Elmwood Ave',
      ward: 'Ward 4 - Metro Center',
      priority: Priority.HIGH,
      priorityScore: 88,
      priorityReason: 'Corroborates active Lincoln High road hazard within 25m radius',
      status: ComplaintStatus.UNDER_REVIEW,
      duplicateScore: 92,
      reporterName: 'David K.',
    },
    {
      // Deliberate duplicate 2 of CIV-2026-8941
      trackingId: 'CIV-2026-8962',
      title: 'Bicycle tire popped on deep crater Lincoln & Elmwood',
      description: 'Wheel popped this morning going to work. Asphalt edge is razor sharp.',
      category: 'roads_potholes',
      aiCategory: 'roads_potholes',
      aiSummary: 'Citizen bicycle rim damage caused by Lincoln & Elmwood crater.',
      latitude: 37.7748,
      longitude: -122.4196,
      address: '738 Elmwood Ave',
      ward: 'Ward 4 - Metro Center',
      priority: Priority.HIGH,
      priorityScore: 86,
      priorityReason: 'Physical vehicle property damage corroborating primary crater report',
      status: ComplaintStatus.UNDER_REVIEW,
      duplicateScore: 89,
      reporterName: 'Marcus T.',
    },
    {
      trackingId: 'CIV-2026-8810',
      title: 'Traffic Signal Desynchronization & Stuck Red Cycle at Junction',
      description: 'Eastbound traffic signal on Grand Blvd is trapped in a 5-minute red hold cycle, causing gridlock backed up across 4 intersections.',
      category: 'traffic_signals',
      aiCategory: 'traffic_signals',
      aiSummary: 'Signal controller hardware timer lockup affecting arterial traffic flow.',
      latitude: 37.7821,
      longitude: -122.4111,
      address: 'Grand Blvd & Lexington Ave Intersection',
      ward: 'Ward 4 - Metro Center',
      priority: Priority.HIGH,
      priorityScore: 86,
      priorityReason: 'Significant vehicular transit disruption across 4 connected intersections; emergency vehicle route delayed',
      status: ComplaintStatus.IN_PROGRESS,
      assignedDept: 'DOT Traffic Signal Operations',
      reporterName: 'Transit Dispatcher Anonymous',
      isAnonymous: true,
    },
    {
      trackingId: 'CIV-2026-8712',
      title: 'Missing Storm Drain Grate on 5th & Metro Ave',
      description: 'Cast iron sewer grate has been dislodged or stolen. Open hole 3 feet deep into stormwater culvert.',
      category: 'water_sewage',
      aiCategory: 'water_sewage',
      aiSummary: 'Open storm drain culvert creating fatal fall hazard for pedestrians and pets.',
      latitude: 37.7782,
      longitude: -122.4150,
      address: '210 5th Avenue',
      ward: 'Ward 4 - Metro Center',
      priority: Priority.CRITICAL,
      priorityScore: 96,
      priorityReason: 'Immediate fall hazard; high pedestrian density; lack of barricade tape',
      status: ComplaintStatus.ASSIGNED,
      assignedDept: 'Municipal Water & Sewer Authority',
      reporterName: 'James Wilson',
    },

    // --- Cluster 2: Ward 2 (Commercial Harbor & Pierfront) - Water & Flooding Hotspot ---
    {
      trackingId: 'CIV-2026-8922',
      title: 'High Pressure Water Main Leak Flooding Pedestrian Walkway',
      description: 'Clean drinking water is bursting from underneath the concrete pavement slab. Water volume has doubled over 3 hours, submerging the sidewalk and entering storefront entries.',
      category: 'water_sewage',
      aiCategory: 'water_sewage',
      aiSummary: 'Sub-pavement water main rupture with ongoing surface flooding. Valve shutdown protocol initiated.',
      latitude: 37.7915,
      longitude: -122.3998,
      address: '318 Market Promenade',
      ward: 'Ward 2 - Commercial Harbor',
      priority: Priority.CRITICAL,
      priorityScore: 91,
      priorityReason: 'Active potable water resource wastage estimated >120 gpm; storefront foundation flooding risk; curb erosion',
      status: ComplaintStatus.ASSIGNED,
      assignedDept: 'Municipal Water & Sewer Authority',
      assignedTo: authorityUser.id,
      reporterName: 'David Chen',
      reporterEmail: 'd.chen@bakeryco.demo',
    },
    {
      // Duplicate of 8922
      trackingId: 'CIV-2026-8928',
      title: 'Flooding sidewalk in front of Old Harbor Bakery',
      description: 'Water bubbling up through sidewalk cracks, water is ankle deep right now.',
      category: 'water_sewage',
      aiCategory: 'water_sewage',
      aiSummary: 'Corroborating report of water main rupture on Market Promenade.',
      latitude: 37.7917,
      longitude: -122.3995,
      address: '324 Market Promenade',
      ward: 'Ward 2 - Commercial Harbor',
      priority: Priority.HIGH,
      priorityScore: 87,
      priorityReason: 'Corroborates high pressure rupture within 30m radius',
      status: ComplaintStatus.UNDER_REVIEW,
      duplicateScore: 94,
      reporterName: 'Sophie Martinez',
    },
    {
      trackingId: 'CIV-2026-8740',
      title: 'Harbor Pier Wooden Planking Rot & Trip Hazard',
      description: 'Several warped and rotten cedar planks have detached from the main pier walkway. Exposed 4-inch rusted spikes.',
      category: 'public_safety',
      aiCategory: 'public_safety',
      aiSummary: 'Structural wood rot and exposed nails along waterfront promenade.',
      latitude: 37.7932,
      longitude: -122.3980,
      address: 'Pier 14 Boardwalk',
      ward: 'Ward 2 - Commercial Harbor',
      priority: Priority.HIGH,
      priorityScore: 78,
      priorityReason: 'Heavy tourist pedestrian density; puncture wound risk from exposed construction spikes',
      status: ComplaintStatus.SUBMITTED,
      assignedDept: 'Public Works Rapid Asphalt Squad',
      reporterName: 'Tourist Patrol',
    },
    {
      trackingId: 'CIV-2026-8680',
      title: 'Commercial Restaurant Grease Trap Odor & Overflow',
      description: 'Grease interceptor trap leaking into storm gutter along Embarcadero service alley. Strong foul odor.',
      category: 'sanitation_waste',
      aiCategory: 'sanitation_waste',
      aiSummary: 'Commercial grease trap spill threatening stormwater runoff.',
      latitude: 37.7905,
      longitude: -122.4010,
      address: 'Alley 3 off Commercial Wharf',
      ward: 'Ward 2 - Commercial Harbor',
      priority: Priority.MEDIUM,
      priorityScore: 64,
      priorityReason: 'Environmental runoff violation; commercial code inspection required',
      status: ComplaintStatus.RESOLVED,
      assignedDept: 'Bureau of Sanitation & Code Enforcement',
      reporterName: 'Harbor Master Office',
    },

    // --- Cluster 3: Ward 7 (South Heights Greenway) - Street Lighting & Electrical Hotspot ---
    {
      trackingId: 'CIV-2026-8890',
      title: 'Cluster of 4 Streetlights Non-Operational Along Park Pathway',
      description: 'Four consecutive solar/grid streetlights have been completely dark for three consecutive nights. The path connects residential apartments to the commuter rail station.',
      category: 'street_lighting',
      aiCategory: 'street_lighting',
      aiSummary: 'Consecutive multi-light electrical circuit outage on public transit connector pathway.',
      latitude: 37.7523,
      longitude: -122.4412,
      address: 'Pineview Greenway Trail, Post 14 to 18',
      ward: 'Ward 7 - South Heights',
      priority: Priority.HIGH,
      priorityScore: 78,
      priorityReason: 'Total blackout along critical evening pedestrian transit connector; multi-fixture failure suggests breaker defect',
      status: ComplaintStatus.UNDER_REVIEW,
      assignedDept: 'Division of Electrical & Street Infrastructure',
      reporterName: 'Maya Patel',
      reporterEmail: 'maya.p@example.org',
    },
    {
      // Duplicate of 8890
      trackingId: 'CIV-2026-8894',
      title: 'Dark walking trail behind South Heights Station',
      description: 'Lights are out again tonight. Impossible to see uneven roots along the trail.',
      category: 'street_lighting',
      aiCategory: 'street_lighting',
      aiSummary: 'Corroborating report of trail lighting blackout.',
      latitude: 37.7525,
      longitude: -122.4415,
      address: 'Pineview Greenway North Fork',
      ward: 'Ward 7 - South Heights',
      priority: Priority.MEDIUM,
      priorityScore: 74,
      priorityReason: 'Matches circuit outage on Pineview trail',
      status: ComplaintStatus.UNDER_REVIEW,
      duplicateScore: 86,
      reporterName: 'Kenji Sato',
    },
    {
      trackingId: 'CIV-2026-8550',
      title: 'Flickering High-Pressure Sodium Lamp Near Bus Stop 19',
      description: 'Streetlight strobing rapidly every few seconds causing severe distraction to drivers turning corner.',
      category: 'street_lighting',
      aiCategory: 'street_lighting',
      aiSummary: 'Ballast failure causing rapid strobing light effect at bus terminal.',
      latitude: 37.7540,
      longitude: -122.4390,
      address: 'South Heights Blvd & 22nd Ave',
      ward: 'Ward 7 - South Heights',
      priority: Priority.MEDIUM,
      priorityScore: 58,
      priorityReason: 'Driver visual distraction at night intersection',
      status: ComplaintStatus.RESOLVED,
      assignedDept: 'Division of Electrical & Street Infrastructure',
      reporterName: 'Bus Driver Transit Union',
    },

    // --- Cluster 4: Ward 3 (East District & Industrial) - Sanitation & Waste Hotspot ---
    {
      trackingId: 'CIV-2026-8854',
      title: 'Repeated Illegal Commercial Waste Dumping at Alley Entrance',
      description: 'Bulk construction debris, broken drywall, paint buckets, and commercial packaging dumped blocking pedestrian alley and stormwater drain intake.',
      category: 'sanitation_waste',
      aiCategory: 'sanitation_waste',
      aiSummary: 'Commercial waste obstruction cleared and license plate surveillance reviewed.',
      latitude: 37.7681,
      longitude: -122.4082,
      address: 'Alley 14, off Cypress & 8th St',
      ward: 'Ward 3 - East District',
      priority: Priority.MEDIUM,
      priorityScore: 62,
      priorityReason: 'Drainage blockage risk before upcoming precipitation; potential unsealed chemical paint buckets',
      status: ComplaintStatus.RESOLVED,
      assignedDept: 'Bureau of Sanitation & Code Enforcement',
      reporterName: 'Carlos Mendez',
      reporterEmail: 'carlos.m@example.org',
    },
    {
      trackingId: 'CIV-2026-8860',
      title: 'Overflowing Public Recycling Bins Along Industrial Park',
      description: 'Cardboard and packaging materials piled 5 feet high, blowing across four-lane avenue in morning wind.',
      category: 'sanitation_waste',
      aiCategory: 'sanitation_waste',
      aiSummary: 'High wind debris dispersal from overflowing industrial recycling collection site.',
      latitude: 37.7665,
      longitude: -122.4060,
      address: 'Industrial Way & 9th Street',
      ward: 'Ward 3 - East District',
      priority: Priority.HIGH,
      priorityScore: 71,
      priorityReason: 'Wind dispersal creating driver vision obstruction on high-speed industrial arterial',
      status: ComplaintStatus.IN_PROGRESS,
      assignedDept: 'Bureau of Sanitation & Code Enforcement',
      reporterName: 'Anonymous Driver',
      isAnonymous: true,
    },
    {
      trackingId: 'CIV-2026-8610',
      title: 'Abandoned Chemical Drums in Vacant Lot',
      description: 'Two unmarked 55-gallon metal barrels left by railroad siding. Rust on bottom seams.',
      category: 'public_safety',
      aiCategory: 'public_safety',
      aiSummary: 'Potential hazardous material disposal investigation required.',
      latitude: 37.7695,
      longitude: -122.4045,
      address: '500 Railroad Spur Ave',
      ward: 'Ward 3 - East District',
      priority: Priority.CRITICAL,
      priorityScore: 89,
      priorityReason: 'Unidentified chemical container risk; proximity to water drainage culvert',
      status: ComplaintStatus.ASSIGNED,
      assignedDept: 'Municipal Emergency Management & Dispatch',
      reporterName: 'Rail Yard Inspector',
    },
  ];

  // Generate 28 additional realistic synthetic complaints to exceed 40 complaints threshold
  const additionalCategories = [
    'roads_potholes', 'street_lighting', 'water_sewage', 'sanitation_waste',
    'traffic_signals', 'public_safety', 'parks_trees', 'roads_potholes'
  ];

  const streets = [
    'Mission Boulevard', 'Van Ness Avenue', 'Columbus Avenue', 'Valencia Street',
    'Geary Boulevard', 'Haight Street', 'Divisadero Street', 'Castro Street',
    'Sunset Boulevard', 'Lombard Street', 'Folsom Street', 'Howard Street'
  ];

  const wardsList = [
    'Ward 4 - Metro Center', 'Ward 2 - Commercial Harbor', 'Ward 7 - South Heights',
    'Ward 3 - East District', 'Ward 5 - Northgate', 'Ward 1 - West Parklands'
  ];

  for (let i = 1; i <= 28; i++) {
    const cat = additionalCategories[i % additionalCategories.length];
    const street = streets[i % streets.length];
    const ward = wardsList[i % wardsList.length];
    const score = Math.floor(35 + Math.random() * 60);
    const prio: Priority = score >= 75 ? Priority.CRITICAL : score >= 50 ? Priority.HIGH : score >= 25 ? Priority.MEDIUM : Priority.LOW;
    const statuses: ComplaintStatus[] = [
      ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, 
      ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED
    ];
    const status = statuses[i % statuses.length];

    complaintsData.push({
      trackingId: `CIV-2026-${7000 + i}`,
      title: `Civic Maintenance Issue on ${street}`,
      description: `Reported civic infrastructure defect regarding ${cat.replace('_', ' ')} located along ${street} near building number ${100 + i * 15}.`,
      category: cat,
      aiCategory: cat,
      aiSummary: `Automated assessment of ${cat.replace('_', ' ')} along ${street}.`,
      latitude: Number((37.75 + Math.random() * 0.05).toFixed(4)),
      longitude: Number((-122.44 + Math.random() * 0.05).toFixed(4)),
      address: `${100 + i * 15} ${street}`,
      ward,
      priority: prio,
      priorityScore: score,
      priorityReason: `Routine municipal assessment; score ${score}/100 evaluated based on location and report factors`,
      status,
      assignedDept: 'Department of Public Works',
      reporterName: `Citizen ${i}`,
    } as any);
  }

  // Insert all complaints with history records
  let createdCount = 0;
  for (const item of complaintsData) {
    const created = await prisma.complaint.create({
      data: {
        trackingId: item.trackingId,
        title: item.title,
        description: item.description,
        category: item.category,
        aiCategory: item.aiCategory,
        aiSummary: item.aiSummary,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        ward: item.ward,
        priority: item.priority,
        priorityScore: item.priorityScore,
        priorityReason: item.priorityReason,
        status: item.status,
        assignedDept: item.assignedDept,
        assignedTo: item.assignedTo || null,
        createdBy: item.createdBy || null,
        reporterName: item.reporterName || 'Citizen Reporter',
        reporterEmail: item.reporterEmail || null,
        isAnonymous: Boolean(item.isAnonymous),
        duplicateScore: item.duplicateScore || null,
        history: {
          create: [
            {
              newStatus: ComplaintStatus.SUBMITTED,
              changedBy: item.reporterName || 'Citizen Reporter',
              actorRole: 'citizen',
              remarks: 'Complaint registered via CivicMind portal.',
            },
            {
              previousStatus: ComplaintStatus.SUBMITTED,
              newStatus: item.status === ComplaintStatus.SUBMITTED ? ComplaintStatus.UNDER_REVIEW : item.status,
              changedBy: 'CivicMind AI Triage Engine',
              actorRole: 'ai_system',
              remarks: `AI scored urgency at ${item.priorityScore}/100. Priority assigned: ${item.priority}.`,
            },
          ],
        },
      },
    });
    createdCount++;
  }

  console.log(`✅ Seeded ${createdCount} synthetic complaints with AI analysis, duplicate links, and audit history.`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
