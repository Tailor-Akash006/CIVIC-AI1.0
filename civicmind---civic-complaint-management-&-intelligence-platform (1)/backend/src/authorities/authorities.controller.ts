import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthoritiesService } from './authorities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Authorities')
@Controller('authorities')
export class AuthoritiesController {
  constructor(private readonly authoritiesService: AuthoritiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active municipal departments and authority dispatchers' })
  async findAll() {
    return this.authoritiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details for a specific authority department' })
  async findById(@Param('id') id: string) {
    return this.authoritiesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new municipal department or authority (Admin only)' })
  async create(@Body() body: { name: string; department: string; email: string; phone?: string }) {
    return this.authoritiesService.create(body);
  }
}
