import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { AccessCounter } from '../src/analytics/schemas/access-counter.schema';
import { Model } from 'mongoose';

describe('AnalyticsController (e2e)', () => {
  let app: INestApplication;
  let accessCounterModel: Model<AccessCounter>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    accessCounterModel = moduleFixture.get<Model<AccessCounter>>(
      getModelToken(AccessCounter.name),
    );

    await accessCounterModel.deleteMany({});
  });

  afterEach(async () => { // Usamos afterEach para fechar a app após cada teste
    await app.close();
  });

  it('/analytics/count (GET) should initially return count 0', () => {
    return request(app.getHttpServer())
      .get('/analytics/count')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('count', 0);
      });
  });

  // --- NOVO TESTE ADICIONADO ---
  it('/analytics/increment (POST) should increment the counter', async () => {
    // Primeiro, incrementa
    await request(app.getHttpServer())
      .post('/analytics/increment')
      .expect(201);

    // Segundo, verifica se o valor foi atualizado
    return request(app.getHttpServer())
      .get('/analytics/count')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('count', 1);
      });
  });
});