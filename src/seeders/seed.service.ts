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

  private readJsonFilesFromFolder(folderPath: string): any[] {
    const files = fs.readdirSync(folderPath);
    return files.map((file) => {
      const filePath = path.join(folderPath, file);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
  }

  async seedPatients() {
    const patientsPath = path.join(__dirname, '../../data/patients');
    if (!fs.existsSync(patientsPath)) {
      this.logger.warn('⚠️ Patients folder not found, skipping...');
      return;
    }

    const patientsData = this.readJsonFilesFromFolder(patientsPath);

    await this.patientModel.deleteMany(); // Clear existing records
    await this.patientModel.insertMany(patientsData);
    this.logger.log(`✅ Seeded ${patientsData.length} patients successfully.`);
  }

  async seedObservations() {
    const observationsPath = path.join(__dirname, '../../data/observations');
    if (!fs.existsSync(observationsPath)) {
      this.logger.warn('⚠️ Observations folder not found, skipping...');
      return;
    }

    const observationsData = this.readJsonFilesFromFolder(observationsPath);

    await this.observationModel.deleteMany(); // Clear existing records
    await this.observationModel.insertMany(observationsData);
    this.logger.log(
      `✅ Seeded ${observationsData.length} observations successfully.`,
    );
  }
}
