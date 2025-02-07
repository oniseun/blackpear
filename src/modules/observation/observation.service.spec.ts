import { ObservationService } from './observation.service';
import { ObservationRepository } from './observation.repository';
import { Observation } from './observation.schema';
import { Types } from 'mongoose';

describe('ObservationService', () => {
  let observationService: ObservationService;
  let observationRepository: ObservationRepository;

  // In-memory mock observation data
  let mockObservations: Observation[];

  beforeEach(() => {
    mockObservations = [
      {
        _id: new Types.ObjectId(),
        resourceType: 'Observation',
        id: 1,
        status: 'final',
        code: {
          text: 'Blood Pressure',
          coding: [{ system: 'http://loinc.org', code: '12345-6' }],
        },
        issued: new Date('2024-01-01T00:00:00Z'),
        subject: { reference: 'Patient/1' },
      } as Observation,
      {
        _id: new Types.ObjectId(),
        resourceType: 'Observation',
        id: 2,
        status: 'final',
        code: {
          text: 'Heart Rate',
          coding: [{ system: 'http://loinc.org', code: '67890-1' }],
        },
        issued: new Date('2024-01-02T00:00:00Z'),
        subject: { reference: 'Patient/1' },
      } as Observation,
      {
        _id: new Types.ObjectId(),
        resourceType: 'Observation',
        id: 3,
        status: 'final',
        code: {
          text: 'Temperature',
          coding: [{ system: 'http://loinc.org', code: '11111-1' }],
        },
        issued: new Date('2024-01-03T00:00:00Z'),
        subject: { reference: 'Patient/2' },
      } as Observation,
    ];

    observationRepository = {
      findByPatientId: jest.fn((patientId: number) =>
        Promise.resolve(
          mockObservations.filter(
            (obs) => obs.subject.reference === `Patient/${patientId}`,
          ),
        ),
      ),
    } as any;

    observationService = new ObservationService(observationRepository);
  });

  describe('getObservationsByPatientId', () => {
    it('should return observations for a valid patient ID', async () => {
      const result = await observationService.getObservationsByPatientId(1);

      expect(result).toEqual([mockObservations[0], mockObservations[1]]);
      expect(observationRepository.findByPatientId).toHaveBeenCalledWith(1);
    });

    it('should return an empty array when no observations exist for a patient', async () => {
      const result = await observationService.getObservationsByPatientId(99);

      expect(result).toEqual([]);
      expect(observationRepository.findByPatientId).toHaveBeenCalledWith(99);
    });
  });
});
