import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TerminusModule,
    // O MongooseModule é necessário aqui para o MongooseHealthIndicator funcionar
    MongooseModule,
  ],
  controllers: [],
})
export class HealthModule {}