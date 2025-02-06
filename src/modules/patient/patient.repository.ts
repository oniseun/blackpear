import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.schema';

@Injectable()
export class PatientRepository {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>) {}

  async findByNhsNumber(nhsNumber: string): Promise<Patient | null> {
    return this.patientModel.findOne({ nhsNumber }).exec();
  }

  async findByLastName(lastName: string): Promise<Patient[]> {
    return this.patientModel.find({ lastName }).exec();
  }
}
