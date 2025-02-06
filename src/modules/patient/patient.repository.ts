import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.schema';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async findByNhsNumber(patientNhsNumber: number): Promise<Patient[]> {
    return this.patientModel
      .find({
        identifier: {
          $elemMatch: { label: 'NHS', value: patientNhsNumber },
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
