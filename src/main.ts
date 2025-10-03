/**
 * @file Ponto de entrada da aplicação NestJS.
 * Configura e inicializa o servidor, aplicando middlewares globais,
 * pipes, filtros e a documentação Swagger.
 * Contém lógica para rodar tanto em ambiente de desenvolvimento local quanto em
 * ambiente serverless (Vercel).
 */

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Aplica configurações globais à instância da aplicação NestJS.
 * Esta função é reutilizada tanto para o servidor local quanto para o serverless.
 * @param {INestApplication} app - A instância da aplicação NestJS.
 */
async function configureApp(app: INestApplication) {
  // Habilita o CORS para permitir requisições de diferentes origens (essencial para frontends).
  app.enableCors();

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Anota AI API Challenge')
    .setDescription('API para contagem de acessos e gerenciamento de usuários.')
    .setVersion('1.0')
    .addTag('analytics', 'Operações relacionadas ao contador de acessos')
    .addTag('users', 'Operações relacionadas aos usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    // Aponta para os assets servidos pelo nosso SwaggerController
    customSwaggerUiPath: require.resolve('swagger-ui-dist/absolute-path.js'),
    customfavIcon: 'https://static.swagger.io/asset/favicon-32x32.png',
    customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.0/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.0/swagger-ui-standalone-preset.min.css',
    ],
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.0/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.0/swagger-ui-standalone-preset.js',
    ],
  });
}

/**
 * Função de inicialização para o ambiente de desenvolvimento local.
 * Inicia um servidor HTTP que escuta em uma porta específica.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configureApp(app);
  // Usa a porta definida no ambiente ou 3000 como padrão.
  await app.listen(process.env.PORT || 3000);
}

// --- Lógica para compatibilidade com Vercel Serverless ---

// Mantém uma instância da aplicação em cache para melhorar a performance,
// evitando recriar a aplicação a cada requisição no ambiente serverless.
let cachedApp: INestApplication;

/**
 * Inicializa a aplicação NestJS para o ambiente serverless, utilizando cache.
 * @returns {Promise<INestApplication>} A instância da aplicação NestJS pronta.
 */
async function bootstrapServerless() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await configureApp(app);
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

/**
 * Handler principal exportado para o Vercel.
 * Cada requisição HTTP recebida pelo Vercel invocará esta função.
 */
export default async function handler(req, res) {
  const app = await bootstrapServerless();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
}

// Condicional para iniciar o servidor local:
// Se não estivermos em um ambiente de produção (como o Vercel),
// a função bootstrap() é chamada para iniciar o servidor local tradicional.
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}