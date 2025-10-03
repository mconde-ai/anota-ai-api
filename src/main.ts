import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

// Função de configuração reutilizável
async function configureApp(app: INestApplication) {
  // MELHORIA 1: Habilitar CORS
  app.enableCors();

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Anota AI API Challenge')
    .setDescription('API para contagem de acessos e gerenciamento de usuários.')
    .setVersion('1.0')
    .addTag('analytics', 'Operações relacionadas ao contador de acessos')
    .addTag('users', 'Operações relacionadas aos usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

// Lógica para rodar localmente
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configureApp(app);

  // MELHORIA 2: Usar a porta do ambiente ou 3000 como padrão
  await app.listen(process.env.PORT || 3000);
}

// Lógica para o Vercel
let cachedApp: INestApplication;

async function bootstrapServerless() {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule);
        await configureApp(app);
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}

export default async function handler(req, res) {
    const app = await bootstrapServerless();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp(req, res);
}

// Inicia o servidor local apenas se não estiver no ambiente Vercel
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}