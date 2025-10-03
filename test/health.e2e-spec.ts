import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should return health status', () => {
    return request(app.getHttpServer())
      .get('/') // Testamos a rota raiz diretamente
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual('ok');
        expect(res.body.info.mongodb.status).toEqual('up');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});