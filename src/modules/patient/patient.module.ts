import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './patient.schema';
import { PatientRepository } from './patient.repository';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
})
export class PatientModule {}
