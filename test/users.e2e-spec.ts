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

  const mockUser = {
    email: 'test.e2e@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Testes para POST /users ---
  describe('/users (POST)', () => {
    it('should create a new user and return it (without the password)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(mockUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(mockUser.email);
          expect(res.body.password).toBeUndefined();
        });
    });
    // ... (outros testes de POST que já tínhamos)
  });

  // --- Testes para GET /users ---
  describe('/users (GET)', () => {
    it('should return an array of users', async () => {
      // Cria um usuário de teste primeiro
      await userModel.create(mockUser);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].email).toEqual(mockUser.email);
          expect(res.body[0].password).toBeUndefined();
        });
    });

    it('should return an empty array if no users exist', () => {
        return request(app.getHttpServer())
          .get('/users')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
          });
      });
  });

  // --- Testes para GET /users/:id ---
  describe('/users/:id (GET)', () => {
    // ... (testes de GET by ID que já tínhamos)
  });

  // --- Testes para PATCH /users/:id ---
  describe('/users/:id (PATCH)', () => {
    it('should update a user and return the updated user', async () => {
      const user = await userModel.create(mockUser);
      const updatedEmail = 'updated.email@example.com';

      return request(app.getHttpServer())
        .patch(`/users/${user._id}`)
        .send({ email: updatedEmail })
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toEqual(updatedEmail);
        });
    });

    it('should correctly re-hash the password when updated', async () => {
        const user = await userModel.create(mockUser);
        const newPassword = 'newStrongPassword123';
  
        await request(app.getHttpServer())
          .patch(`/users/${user._id}`)
          .send({ password: newPassword });
  
    // Busca o usuário diretamente no banco para verificar o hash
    const updatedUserInDb = await userModel.findById(user._id);
        if (!updatedUserInDb) {
          // Se o usuário não for encontrado, o teste deve falhar com uma mensagem clara.
          throw new Error('User not found in database after update');
        }
        expect(updatedUserInDb.password).not.toEqual(newPassword); // Garante que a senha foi hasheada
        expect(updatedUserInDb.password).not.toEqual(user.password); // Garante que o hash mudou
      });

    it('should return 404 if user to update is not found', () => {
      const nonExistentId = '605c6c2e8c8a1b001f3e8b8c';
      return request(app.getHttpServer())
        .patch(`/users/${nonExistentId}`)
        .send({ email: 'any@email.com' })
        .expect(404);
    });
  });

  // --- Testes para DELETE /users/:id ---
  describe('/users/:id (DELETE)', () => {
    it('should delete a user and return 204 No Content', async () => {
      const user = await userModel.create(mockUser);

      await request(app.getHttpServer())
        .delete(`/users/${user._id}`)
        .expect(204);

      // Tenta buscar o usuário deletado para confirmar que não existe mais
      return request(app.getHttpServer())
        .get(`/users/${user._id}`)
        .expect(404);
    });

    it('should return 404 if user to delete is not found', () => {
      const nonExistentId = '605c6c2e8c8a1b001f3e8b8c';
      return request(app.getHttpServer())
        .delete(`/users/${nonExistentId}`)
        .expect(404);
    });
  });
});