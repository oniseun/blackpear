import { PatientRepository } from './patient.repository';
import { Patient } from './patient.schema';
import { createMock } from '@golevelup/ts-jest';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

describe('PatientRepository', () => {
  let patientRepository: PatientRepository;
  let patientModel: Model<Patient>;

  beforeEach(() => {
    patientModel = createMock<Model<Patient>>();
    patientRepository = new PatientRepository(patientModel);
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

  describe('findByNhsNumber', () => {
    it('should return a list of patients when searching by NHS Number', async () => {
      jest.spyOn(patientModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPatients),
      } as any);

      const result = await patientRepository.findByNhsNumber('1111111112');

      expect(result).toEqual(mockPatients);
      expect(patientModel.find).toHaveBeenCalledWith({
        identifier: {
          $elemMatch: {
            $or: [
              { label: 'NHS', value: '1111111112' },
              {
                system: 'https://fhir.nhs.uk/Id/nhs-number',
                value: '1111111112',
              },
            ],
          },
        },
      });
    });

    it('should return an empty array if no patient is found by NHS Number', async () => {
      jest.spyOn(patientModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await patientRepository.findByNhsNumber('9999999999');

      expect(result).toEqual([]);
      expect(patientModel.find).toHaveBeenCalledWith({
        identifier: {
          $elemMatch: {
            $or: [
              { label: 'NHS', value: '9999999999' },
              {
                system: 'https://fhir.nhs.uk/Id/nhs-number',
                value: '9999999999',
              },
            ],
          },
        },
      });
    });
  });

  describe('findBySurname', () => {
    it('should return a list of patients when searching by surname', async () => {
      jest.spyOn(patientModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPatients),
      } as any);

      const result = await patientRepository.findBySurname('Smith');

      expect(result).toEqual(mockPatients);
      expect(patientModel.find).toHaveBeenCalledWith({
        'name.family': { $regex: new RegExp(`^Smith$`, 'i') },
      });
    });

    it('should return an empty array if no patient is found by surname', async () => {
      jest.spyOn(patientModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await patientRepository.findBySurname('Nonexistent');

      expect(result).toEqual([]);
      expect(patientModel.find).toHaveBeenCalledWith({
        'name.family': { $regex: new RegExp(`^Nonexistent$`, 'i') },
      });
    });
  });
});
