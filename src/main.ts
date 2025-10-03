import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

/**
 * Função de configuração reutilizável para a aplicação NestJS.
 * Aplica configurações globais como CORS, pipes de validação e filtros de exceção.
 * @param app A instância da aplicação NestJS.
 */
async function configureApp(app: INestApplication) {
  // Habilita o CORS para permitir que o frontend (em outro domínio) acesse a API.
  app.enableCors();

  const httpAdapterHost = app.get(HttpAdapterHost);
  // Registra um filtro global para capturar todas as exceções não tratadas.
  // Isso garante que a API sempre retorne um JSON padronizado em caso de erro.
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não existem no DTO.
    forbidNonWhitelisted: true, // Lança um erro se propriedades inesperadas forem enviadas.
    transform: true, // Transforma o payload para a instância correta do DTO.
  }));

  // Configuração do Swagger para gerar a documentação da API.
  const config = new DocumentBuilder()
    .setTitle('Anota AI API Challenge')
    .setDescription('API para contagem de acessos e gerenciamento de usuários.')
    .setVersion('1.0')
    .addTag('analytics', 'Operações relacionadas ao contador de acessos')
    .addTag('users', 'Operações relacionadas aos usuários')
    // ... (configuração do swagger)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
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

// Mantém uma instância da aplicação em cache para melhorar a performance em ambientes serverless,
// evitando recriar a aplicação a cada requisição.
let cachedApp: INestApplication;


/**
 * Inicializa a aplicação NestJS para o ambiente serverless.
 * Usa uma instância em cache se já existir.
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
 * Cada requisição recebida pelo Vercel invocará esta função.
 */
export default async function handler(req, res) {
    const app = await bootstrapServerless();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp(req, res);
}

// Condicional para iniciar o servidor local:
// Se a variável de ambiente NODE_ENV não for 'production' (como é no Vercel),
// a função bootstrap() é chamada para iniciar o servidor local.
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}