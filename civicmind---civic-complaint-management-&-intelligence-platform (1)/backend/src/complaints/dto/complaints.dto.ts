import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  MinLength, 
  MaxLength, 
  IsEnum, 
  Min, 
  Max 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Priority, ComplaintStatus } from '@prisma/client';

export class CreateComplaintDto {
  @ApiProperty({ example: 'Severe Caved-In Pothole Near Crosswalk', description: 'Complaint title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(120)
  title: string;

  @ApiProperty({ 
    example: 'Deep road cavity opened at the crosswalk. Cyclists swerving into traffic.', 
    description: 'Detailed description of the civic problem' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty({ 
    example: 'roads_potholes', 
    description: 'Civic issue category (roads_potholes, water_sewage, street_lighting, sanitation_waste, traffic_signals, public_safety, parks_trees, other)' 
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 37.7749, description: 'Latitude coordinate' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -122.4194, description: 'Longitude coordinate' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: '742 Elmwood Ave', description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Ward 4 - Metro Center', description: 'Municipal ward' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL of uploaded photo' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether to submit anonymously' })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: 'Elena Rostova', description: 'Citizen name' })
  @IsOptional()
  @IsString()
  reporterName?: string;

  @ApiPropertyOptional({ example: 'elena@example.org', description: 'Citizen email' })
  @IsOptional()
  @IsString()
  reporterEmail?: string;

  @ApiPropertyOptional({ example: '+1 (555) 234-8901', description: 'Citizen phone' })
  @IsOptional()
  @IsString()
  reporterPhone?: string;
}

export class UpdateComplaintStatusDto {
  @ApiProperty({ enum: ComplaintStatus, example: ComplaintStatus.IN_PROGRESS })
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;

  @ApiPropertyOptional({ example: 'Field crew arrived on site with asphalt mix.' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ example: 'Supervisor Marcus Vance' })
  @IsOptional()
  @IsString()
  changedBy?: string;
}

export class AssignComplaintDto {
  @ApiPropertyOptional({ example: 'usr-123', description: 'User ID of assigned officer' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Public Works - Rapid Asphalt Unit', description: 'Department name' })
  @IsOptional()
  @IsString()
  assignedDept?: string;

  @ApiPropertyOptional({ example: 'Supervisor Marcus Vance', description: 'Officer name' })
  @IsOptional()
  @IsString()
  officerName?: string;

  @ApiPropertyOptional({ example: 'Assigned to Ward 4 rapid dispatch team.' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class QueryComplaintsDto {
  @ApiPropertyOptional({ example: 'SUBMITTED', description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'CRITICAL', description: 'Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'roads_potholes', description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Ward 4', description: 'Filter by ward' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ example: 'Elmwood', description: 'Search keywords' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}
