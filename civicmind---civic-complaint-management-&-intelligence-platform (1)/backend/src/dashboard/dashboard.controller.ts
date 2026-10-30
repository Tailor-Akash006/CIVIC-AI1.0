import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard Analytics')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Retrieve high-level municipal KPI statistics' })
  @ApiResponse({ status: 200, description: 'Aggregate complaint statistics and resolution percentage' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('priority')
  @ApiOperation({ summary: 'Retrieve complaint distribution grouped by priority (LOW, MEDIUM, HIGH, CRITICAL)' })
  async getPriorityBreakdown() {
    return this.dashboardService.getPriorityBreakdown();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Retrieve complaint distribution grouped by civic category' })
  async getCategoryBreakdown() {
    return this.dashboardService.getCategoryBreakdown();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Retrieve complaint volume trends grouped by date' })
  @ApiQuery({ name: 'days', required: false, example: 14 })
  async getTrends(@Query('days') days?: number) {
    return this.dashboardService.getTrends(days ? Number(days) : 14);
  }

  @Get('hotspots')
  @ApiOperation({ summary: 'Identify geographic incident hotspots via spatial clustering' })
  @ApiResponse({ status: 200, description: 'List of geographic clusters with dominant issues and AI insights' })
  async getHotspots() {
    return this.dashboardService.getHotspots();
  }
}
