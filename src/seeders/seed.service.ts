import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from '../modules/patient/patient.schema';
import { Observation } from '../modules/observation/observation.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Observation.name)
    private readonly observationModel: Model<Observation>,
  ) {}

  async seedPatients() {
    const filePath = path.join(__dirname, '../../data/patients.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await this.patientModel.deleteMany();
    await this.patientModel.insertMany(data);
    this.logger.log('✅ Patients seeded successfully');
  }

  async seedObservations() {
    const filePath = path.join(__dirname, '../../data/observations.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await this.observationModel.deleteMany();
    await this.observationModel.insertMany(data);
    this.logger.log('✅ Observations seeded successfully');
  }
}
