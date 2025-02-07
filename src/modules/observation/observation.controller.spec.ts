import { ObservationController } from './observation.controller';
import { ObservationService } from './observation.service';
import { Observation } from './observation.schema';
import { ObservationDto } from './observation.dto';
import { BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Types } from 'mongoose';

describe('ObservationController', () => {
  let observationController: ObservationController;
  let observationService: ObservationService;

  beforeEach(() => {
    observationService = createMock<ObservationService>();
    observationController = new ObservationController(observationService);
  });

  const mockObservations: Observation[] = [
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
  ];

  describe('getObservations', () => {
    it('should return a list of observations when a valid patientId is provided', async () => {
      jest
        .spyOn(observationService, 'getObservationsByPatientId')
        .mockResolvedValue(mockObservations);

      const result = await observationController.getObservations(1);

      expect(result).toEqual(mockObservations.map(ObservationDto.fromEntity));
      expect(
        observationService.getObservationsByPatientId,
      ).toHaveBeenCalledWith(1);
    });

    it('should return an empty array when no observations are found for a patient', async () => {
      jest
        .spyOn(observationService, 'getObservationsByPatientId')
        .mockResolvedValue([]);

      const result = await observationController.getObservations(2);

      expect(result).toEqual([]);
      expect(
        observationService.getObservationsByPatientId,
      ).toHaveBeenCalledWith(2);
    });

    it('should throw BadRequestException when patientId is missing', async () => {
      await expect(
        observationController.getObservations(undefined as any),
      ).rejects.toThrow(new BadRequestException('patientId is required.'));
    });
  });
});
