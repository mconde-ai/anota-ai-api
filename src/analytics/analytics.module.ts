import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessCounter, AccessCounterSchema } from './schemas/access-counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessCounter.name, schema: AccessCounterSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}