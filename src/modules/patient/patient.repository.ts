import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.schema';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async findByNhsNumberOrSurname(searchValue: string): Promise<Patient[]> {
    return this.patientModel
      .find({
        $or: [
          {
            identifier: {
              $elemMatch: { label: 'NHS', value: Number(searchValue) },
            },
          },
          { 'name.family': { $regex: new RegExp(`^${searchValue}$`, 'i') } },
        ],
      })
      .exec();
  }
}
