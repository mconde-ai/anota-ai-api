import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    /**
     * Carrega e disponibiliza as variáveis de ambiente de forma global para a aplicação.
     * Lê a partir de um arquivo .env na raiz do projeto.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Módulo para servir arquivos estáticos. Essencial para que o Swagger UI funcione
     * corretamente em ambientes serverless como o Vercel.
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api/docs',
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