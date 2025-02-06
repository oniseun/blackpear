import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observation } from './observation.schema';

@Injectable()
export class ObservationRepository {
  constructor(@InjectModel(Observation.name) private observationModel: Model<Observation>) {}

  async findByPatientId(patientId: string): Promise<Observation[]> {
    return this.observationModel.find({ patientId }).exec();
  }
}
