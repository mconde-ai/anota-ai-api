import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    UsersModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}