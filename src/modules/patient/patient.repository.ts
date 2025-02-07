import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.schema';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async findByNhsNumber(patientNhsNumber: string): Promise<Patient[]> {
    return this.patientModel
      .find({
        identifier: {
          $elemMatch: {
            $or: [
              { label: 'NHS', value: patientNhsNumber },
              {
                system: 'https://fhir.nhs.uk/Id/nhs-number',
                value: patientNhsNumber,
              },
            ],
          },
        },
      })
      .exec();
  }

  async findBySurname(surname: string): Promise<Patient[]> {
    return this.patientModel
      .find({
        'name.family': { $regex: new RegExp(`^${surname}$`, 'i') },
      })
      .exec();
  }
}
