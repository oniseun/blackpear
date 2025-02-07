import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';
import { Patient } from './patient.schema';
import { Types } from 'mongoose';

describe('PatientService', () => {
  let patientService: PatientService;
  let patientRepository: PatientRepository;

  let mockPatients: Patient[];

  beforeEach(() => {
    mockPatients = [
      {
        _id: new Types.ObjectId(),
        resourceType: 'Patient',
        id: 1,
        identifier: [
          { system: 'https://fhir.nhs.uk/Id/nhs-number', value: '1111111112' },
        ],
        name: [{ text: 'John Smith', family: 'Smith', given: ['John'] }],
        telecom: [],
        gender: 'male',
        birthDate: new Date('1985-01-01'),
        address: [],
        observations: [],
      } as Patient,
      {
        _id: new Types.ObjectId(),
        resourceType: 'Patient',
        id: 2,
        identifier: [
          { system: 'https://fhir.nhs.uk/Id/nhs-number', value: '2222222222' },
        ],
        name: [{ text: 'Jane Doe', family: 'Doe', given: ['Jane'] }],
        telecom: [],
        gender: 'female',
        birthDate: new Date('1990-05-15'),
        address: [],
        observations: [],
      } as Patient,
      {
        _id: new Types.ObjectId(),
        resourceType: 'Patient',
        id: 3,
        identifier: [
          { system: 'https://fhir.nhs.uk/Id/nhs-number', value: '3333333333' },
        ],
        name: [{ text: 'Alice Johnson', family: 'Johnson', given: ['Alice'] }],
        telecom: [],
        gender: 'female',
        birthDate: new Date('2000-12-20'),
        address: [],
        observations: [],
      } as Patient,
    ] as Patient[];

    patientRepository = {
      findByNhsNumber: jest.fn((nhsNumber: string) =>
        Promise.resolve(
          mockPatients.filter((p) =>
            p.identifier.some(
              (id) =>
                id.system === 'https://fhir.nhs.uk/Id/nhs-number' &&
                id.value === nhsNumber,
            ),
          ),
        ),
      ),
      findBySurname: jest.fn((surname: string) =>
        Promise.resolve(
          mockPatients.filter((p) =>
            p.name.some(
              (n) => n.family.toLowerCase() === surname.toLowerCase(),
            ),
          ),
        ),
      ),
    } as any;

    patientService = new PatientService(patientRepository);
  });

  describe('getPatientByNhsNumber', () => {
    it('should return a patient when a valid NHS number is provided', async () => {
      const result = await patientService.getPatientByNhsNumber('1111111112');
      expect(result).toEqual([mockPatients[0]]);
      expect(patientRepository.findByNhsNumber).toHaveBeenCalledWith(
        '1111111112',
      );
    });

    it('should return an empty array when no patient is found by NHS number', async () => {
      const result = await patientService.getPatientByNhsNumber('9999999999');
      expect(result).toEqual([]);
      expect(patientRepository.findByNhsNumber).toHaveBeenCalledWith(
        '9999999999',
      );
    });
  });

  describe('getPatientsBySurname', () => {
    it('should return a patient when a valid surname is provided', async () => {
      const result = await patientService.getPatientsBySurname('Doe');
      expect(result).toEqual([mockPatients[1]]);
      expect(patientRepository.findBySurname).toHaveBeenCalledWith('Doe');
    });

    it('should return an empty array when no patient is found by surname', async () => {
      const result = await patientService.getPatientsBySurname('Nonexistent');
      expect(result).toEqual([]);
      expect(patientRepository.findBySurname).toHaveBeenCalledWith(
        'Nonexistent',
      );
    });
  });
});
