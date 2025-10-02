import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança um erro se propriedades extras forem enviadas
    transform: true, // Transforma o payload para a instância do DTO
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

  await app.listen(3000);
}
bootstrap();