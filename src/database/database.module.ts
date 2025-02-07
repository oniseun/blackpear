import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Patient, PatientSchema } from '../modules/patient/patient.schema';
import {
  Observation,
  ObservationSchema,
} from '../modules/observation/observation.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Patient.name,
        useFactory: () => {
          console.log('📌 Registering Patient Model...');
          return PatientSchema;
        },
      },
      {
        name: Observation.name,
        useFactory: () => {
          console.log('📌 Registering Observation Model...');
          return ObservationSchema;
        },
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const DB_USERNAME = configService.get<string>('DB_USERNAME');
        const DB_PASSWORD = configService.get<string>('DB_PASSWORD');
        const DB_HOST = configService.get<string>('DB_HOST');
        const DB_PORT = configService.get<string>('DB_PORT');
        const DB_NAME = configService.get<string>('DB_NAME');

        const uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

        console.log(
          `🔗 Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        );
        return {
          uri,
          serverSelectionTimeoutMS: 60000,
          socketTimeoutMS: 60000,
          connectTimeoutMS: 60000,
          maxPoolSize: 50,
          minPoolSize: 5,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
