import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComplaintsService } from './complaints.service';
import { 
  CreateComplaintDto, 
  UpdateComplaintStatusDto, 
  AssignComplaintDto, 
  QueryComplaintsDto 
} from './dto/complaints.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Submit a new citizen complaint (Supports anonymous or authenticated)' })
  @ApiResponse({ status: 201, description: 'Complaint registered and triaged with Gemini AI' })
  async create(
    @Body() dto: CreateComplaintDto,
    @CurrentUser() user?: any,
  ) {
    return this.complaintsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve complaints list with filtering, searching, and pagination' })
  @ApiResponse({ status: 200, description: 'List of matching complaints' })
  async findAll(@Query() query: QueryComplaintsDto) {
    return this.complaintsService.findAll(query);
  }

  @Get('tracking/:trackingId')
  @ApiOperation({ summary: 'Public complaint tracking by citizen tracking ID (Masks sensitive data)' })
  @ApiResponse({ status: 200, description: 'Complaint details and timeline status' })
  @ApiResponse({ status: 404, description: 'Tracking ID not found' })
  async findByTrackingId(@Param('trackingId') trackingId: string) {
    return this.complaintsService.findByTrackingId(trackingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve full complaint dossier by ID or tracking number' })
  @ApiResponse({ status: 200, description: 'Full complaint record including history and duplicates' })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  async findById(@Param('id') id: string) {
    return this.complaintsService.findById(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Retrieve chronological audit timeline history for a complaint' })
  async getHistory(@Param('id') id: string) {
    return this.complaintsService.getHistory(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUTHORITY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update complaint status and record audit trail (Authority / Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.complaintsService.updateStatus(id, dto, user.id, user.name);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUTHORITY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign complaint to an authority officer or department' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignComplaintDto,
    @CurrentUser() user: any,
  ) {
    return this.complaintsService.assign(id, dto, user.id);
  }

  @Post(':id/merge/:duplicateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUTHORITY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge a duplicate complaint into a primary complaint ticket' })
  async mergeDuplicates(
    @Param('id') primaryId: string,
    @Param('duplicateId') duplicateId: string,
  ) {
    return this.complaintsService.mergeDuplicates(primaryId, duplicateId);
  }
}
