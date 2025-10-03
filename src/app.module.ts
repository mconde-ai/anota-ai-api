import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule as CustomSwaggerModule } from './swagger/swagger.module';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus'; 

@Module({
  imports: [
    /**
     * Carrega e disponibiliza as variáveis de ambiente (do arquivo .env)
     * de forma global para toda a aplicação.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Configura a conexão principal com o banco de dados MongoDB de forma assíncrona.
     * Utiliza o ConfigService para obter a URL de conexão a partir das variáveis de ambiente.
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),

    // Módulos de funcionalidade da aplicação
    TerminusModule,
    HealthModule,
    CustomSwaggerModule,
    UsersModule,
    AnalyticsModule,
    
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}