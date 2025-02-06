import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../modules/patient/patient.schema';
import {
  Observation,
  ObservationSchema,
} from '../modules/observation/observation.schema';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
