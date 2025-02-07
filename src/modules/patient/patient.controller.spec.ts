import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientDto } from './patient.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Patient } from './patient.schema';
import { Types } from 'mongoose';

describe('PatientController', () => {
  let patientController: PatientController;
  let patientService: PatientService;

  beforeEach(() => {
    patientService = createMock<PatientService>();
    patientController = new PatientController(patientService);
  });

  const mockPatients: Patient[] = [
    {
      _id: new Types.ObjectId(),
      resourceType: 'Patient',
      id: 1,
      identifier: [
        { system: 'https://fhir.nhs.uk/Id/nhs-number', value: '1111111112' },
      ],
      name: [
        {
          text: 'John Smith',
          family: 'Smith',
          given: ['John'],
        },
      ],
      telecom: [],
      gender: 'male',
      birthDate: new Date('1985-01-01'),
      address: [],
      observations: [],
    } as Patient,
  ];

  describe('getPatient', () => {
    it('should return a list of patients when searching by NHS Number', async () => {
      jest
        .spyOn(patientService, 'getPatientByNhsNumber')
        .mockResolvedValue(mockPatients);
      const spySurname = jest.spyOn(patientService, 'getPatientsBySurname');

      const result = await patientController.getPatient(
        '1111111112',
        undefined,
      );

      expect(result).toEqual(mockPatients.map(PatientDto.fromEntity));
      expect(patientService.getPatientByNhsNumber).toHaveBeenCalledWith(
        '1111111112',
      );
      expect(spySurname).not.toHaveBeenCalled();
    });

    it('should return a list of patients when searching by surname', async () => {
      jest
        .spyOn(patientService, 'getPatientsBySurname')
        .mockResolvedValue(mockPatients);
      const spyNhsNumber = jest.spyOn(patientService, 'getPatientByNhsNumber');

      const result = await patientController.getPatient(undefined, 'Smith');

      expect(result).toEqual(mockPatients.map(PatientDto.fromEntity));
      expect(patientService.getPatientsBySurname).toHaveBeenCalledWith('Smith');
      expect(spyNhsNumber).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when neither nhsNumber nor surname is provided', async () => {
      await expect(
        patientController.getPatient(undefined, undefined),
      ).rejects.toThrow(
        new BadRequestException(
          'Either nhsNumber or surname must be provided.',
        ),
      );
    });

    it('should throw BadRequestException when both nhsNumber and surname are provided', async () => {
      await expect(
        patientController.getPatient('1111111112', 'Smith'),
      ).rejects.toThrow(
        new BadRequestException(
          'Only one of nhsNumber or surname must be provided.',
        ),
      );
    });

    it('should throw NotFoundException when no patients are found by NHS Number', async () => {
      jest.spyOn(patientService, 'getPatientByNhsNumber').mockResolvedValue([]);

      await expect(
        patientController.getPatient('9999999999', undefined),
      ).rejects.toThrow(
        new NotFoundException(
          'No patients found matching the search criteria.',
        ),
      );
    });

    it('should throw NotFoundException when no patients are found by surname', async () => {
      jest.spyOn(patientService, 'getPatientsBySurname').mockResolvedValue([]);

      await expect(
        patientController.getPatient(undefined, 'Nonexistent'),
      ).rejects.toThrow(
        new NotFoundException(
          'No patients found matching the search criteria.',
        ),
      );
    });
  });
});
