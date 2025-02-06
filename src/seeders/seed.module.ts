import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../modules/patient/patient.schema';
import {
  Observation,
  ObservationSchema,
} from '../modules/observation/observation.schema';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
