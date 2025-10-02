import { Controller, Get, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('increment') // Rota: POST /analytics/increment
  increment() {
    return this.analyticsService.increment();
  }

  @Get('count') // Rota: GET /analytics/count
  getCount() {
    return this.analyticsService.getCount();
  }
}