import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../src/ai/ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return undefined; // Test rule-based fallback
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate Haversine distance between coordinates accurately', () => {
    // Distance between 37.7749, -122.4194 and 37.7751, -122.4192 is approximately 28-35 meters
    const dist = service.calculateDistanceMeters(37.7749, -122.4194, 37.7751, -122.4192);
    expect(dist).toBeGreaterThan(15);
    expect(dist).toBeLessThan(50);
  });

  it('should triage critical life safety hazards with score >= 75 (CRITICAL)', async () => {
    const result = await service.analyzeComplaint({
      title: 'Active high pressure gas leak and road cavity',
      description: 'Severe hazard, deep crater and water bubbling near Lincoln High school pedestrian crosswalk.',
      providedCategory: 'roads_potholes',
      latitude: 37.7749,
      longitude: -122.4194,
    });

    expect(result.priorityScore).toBeGreaterThanOrEqual(75);
    expect(result.priorityLevel).toBe('CRITICAL');
    expect(result.urgencyType).toBe('immediate_hazard');
    expect(result.priorityReasons.length).toBeGreaterThan(0);
    expect(result.isFallback).toBe(true); // Using rule-based fallback when key is not present
  });

  it('should detect suspected duplicate complaints within 300 meters', () => {
    const newComplaint = {
      title: 'Pothole on Elmwood Ave',
      description: 'Huge hole in pavement outside school gate',
      category: 'roads_potholes',
      latitude: 37.7749,
      longitude: -122.4194,
    };

    const existingComplaints = [
      {
        id: 'c-1',
        trackingId: 'CIV-2026-8941',
        title: 'Deep road cavity on Elmwood Ave',
        description: 'Pothole outside Lincoln High school crosswalk',
        category: 'roads_potholes',
        latitude: 37.7750,
        longitude: -122.4193, // ~20m away
        createdAt: new Date(),
      },
      {
        id: 'c-2',
        trackingId: 'CIV-2026-9999',
        title: 'Broken streetlight far away',
        description: 'Dark path in South Heights',
        category: 'street_lighting',
        latitude: 37.7500,
        longitude: -122.4400, // ~4km away
        createdAt: new Date(),
      },
    ];

    const duplicates = service.evaluateDuplicateCandidates(newComplaint, existingComplaints);
    expect(duplicates.length).toBe(1);
    expect(duplicates[0].trackingId).toBe('CIV-2026-8941');
    expect(duplicates[0].similarityScore).toBeGreaterThanOrEqual(60);
    expect(duplicates[0].distanceMeters).toBeLessThan(100);
  });
});
