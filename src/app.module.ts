import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose'; // 1. Importe o MongooseModule

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/anota-ai-db'), // 2. Adicione a conexão
    UsersModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}