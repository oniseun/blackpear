import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Patient & Observation API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /patients', () => {
    it('should retrieve a patient by NHS number', async () => {
      return request(app.getHttpServer())
        .get('/patients?nhsNumber=1111111111')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].id).toBe(1);
          expect(res.body[0].identifier).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                system: 'https://fhir.nhs.uk/Id/nhs-number',
                value: '1111111111',
              }),
            ]),
          );
        });
    });

    it('should retrieve a patient by surname', async () => {
      return request(app.getHttpServer())
        .get('/patients?surname=Smith')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].name).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ family: 'Smith' }),
            ]),
          );
        });
    });

    it('should return 400 if no search parameter is provided', async () => {
      return request(app.getHttpServer())
        .get('/patients')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Either nhsNumber or surname must be provided.',
          );
        });
    });

    it('should return 404 if no patient matches the query', async () => {
      return request(app.getHttpServer())
        .get('/patients?nhsNumber=9999999999')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(
            'No patients found matching the search criteria.',
          );
        });
    });
  });

  describe('GET /observations', () => {
    it('should retrieve observations for a valid patient ID', async () => {
      return request(app.getHttpServer())
        .get('/observations?patientId=1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].subject.reference).toBe('Patient/1');
          expect(res.body[0].resourceType).toBe('Observation');
        });
    });

    it('should return an empty array when no observations exist', async () => {
      return request(app.getHttpServer())
        .get('/observations?patientId=99')
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should return 400 when patientId is missing', async () => {
      return request(app.getHttpServer())
        .get('/observations')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('patientId is required.');
        });
    });

    it('should return 400 when patientId is not a valid number.', async () => {
      return request(app.getHttpServer())
        .get('/observations?patientId=string99')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('patientId must be a valid number.');
        });
    });
  });
});
