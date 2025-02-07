import { ObservationRepository } from './observation.repository';
import { Observation } from './observation.schema';
import { createMock } from '@golevelup/ts-jest';
import { Model, Types } from 'mongoose';

describe('ObservationRepository', () => {
  let observationRepository: ObservationRepository;
  let observationModel: Model<Observation>;

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

    observationModel = createMock<Model<Observation>>();
    observationRepository = new ObservationRepository(observationModel);

    jest.spyOn(observationModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockObservations),
    } as any);
  });

  describe('findByPatientId', () => {
    it('should return observations for a valid patient ID', async () => {
      const result = await observationRepository.findByPatientId(1);

      expect(result).toEqual(mockObservations);
      expect(observationModel.find).toHaveBeenCalledWith({
        'subject.reference': 'Patient/1',
      });
    });

    it('should return an empty array when no observations exist for a patient', async () => {
      jest.spyOn(observationModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await observationRepository.findByPatientId(99);

      expect(result).toEqual([]);
      expect(observationModel.find).toHaveBeenCalledWith({
        'subject.reference': 'Patient/99',
      });
    });
  });
});
