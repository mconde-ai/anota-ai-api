import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

// Função para configurar a aplicação.
async function configureApp(app: INestApplication) {
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

// Lógica para rodar localmente (npm run start:dev)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configureApp(app); // Aplica as configurações
  await app.listen(3000);
}

// Se não estiver no ambiente Vercel, roda o servidor local
if (!process.env.VERCEL) {
  bootstrap();
}

// Lógica para o Vercel (o que será exportado)
let cachedApp: INestApplication;

export default async function handler(req, res) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await configureApp(app); // Aplica as configurações
    await app.init();
    cachedApp = app;
  }
  const expressApp = cachedApp.getHttpAdapter().getInstance();
  expressApp(req, res);
}