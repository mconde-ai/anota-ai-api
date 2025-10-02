import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';
import { Model } from 'mongoose';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  // Dados de teste que vamos reusar
  const mockUser = {
    email: 'test.e2e@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // IMPORTANTE: Precisamos aplicar o mesmo ValidationPipe da nossa aplicação principal
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
  });

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Início dos Testes ---

  describe('/users (POST)', () => {
    it('should create a new user and return it (without the password)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(mockUser)
        .expect(201) // Espera o status 201 Created
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(mockUser.email);
          expect(res.body.password).toBeUndefined(); // Garante que a senha não foi retornada
        });
    });

    it('should fail if the email is already in use', async () => {
      // Primeiro, cria o usuário
      await request(app.getHttpServer()).post('/users').send(mockUser);

      // Segundo, tenta criar o mesmo usuário de novo
      return request(app.getHttpServer())
        .post('/users')
        .send(mockUser)
        .expect(409);
    });

    it('should fail if the email is invalid', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400); // Espera o erro de validação (Bad Request)
    });

    it('should fail if the password is too short', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({ email: 'good.email@example.com', password: '123' })
          .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id (without the password)', async () => {
      // Primeiro, cria um usuário para termos um ID para buscar
      const response = await request(app.getHttpServer()).post('/users').send(mockUser);
      const userId = response.body._id;

      // Agora, busca o usuário por esse ID
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toEqual(userId);
            expect(res.body.email).toEqual(mockUser.email);
            expect(res.body.password).toBeUndefined();
        });
    });

    it('should return a 404 if user is not found', () => {
        const nonExistentId = '605c6c2e8c8a1b001f3e8b8c'; // Um ID válido, mas que não existe
        return request(app.getHttpServer())
          .get(`/users/${nonExistentId}`)
          .expect(404); // Espera Not Found
    });
  });
});