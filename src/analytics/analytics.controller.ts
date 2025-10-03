import { Controller, Get, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAnalyticsDto } from './dto/response-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Post('increment')
  @ApiOperation({ summary: 'Incrementa o contador de acessos' })
  @ApiResponse({
    status: 201, description: 'Contador incrementado com sucesso.',
    type: ResponseAnalyticsDto,
  })
  increment() {
    return this.analyticsService.increment();
  }

  @Get('count')
  @ApiOperation({ summary: 'Consulta o valor do contador de acessos' })
  @ApiResponse({
    status: 200, description: 'Valor do contador retornado com sucesso.',
    type: ResponseAnalyticsDto,
  })
  getCount() {
    return this.analyticsService.getCount();
  }
}