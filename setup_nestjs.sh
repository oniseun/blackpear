#!/bin/bash

# Define directories
SEEDER_DIR="src/seeders"
DATA_DIR="data"

# Create directories
mkdir -p $SEEDER_DIR
mkdir -p $DATA_DIR

# Create and write Seed Module
cat > $SEEDER_DIR/seed.module.ts <<EOF
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../modules/patient/patient.schema';
import { Observation, ObservationSchema } from '../modules/observation/observation.schema';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: \`mongodb://\${process.env.DB_USERNAME}:\${process.env.DB_PASSWORD}@\${process.env.DB_HOST}:\${process.env.DB_PORT}/\${process.env.DB_NAME}\`,
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
EOF

# Create and write Seed Service
cat > $SEEDER_DIR/seed.service.ts <<EOF
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
    @InjectModel(Observation.name) private readonly observationModel: Model<Observation>,
  ) {}

  async seedPatients() {
    const filePath = path.join(__dirname, '../../data/patients.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await this.patientModel.deleteMany(); // Clears existing records
    await this.patientModel.insertMany(data);
    this.logger.log('✅ Patients seeded successfully');
  }

  async seedObservations() {
    const filePath = path.join(__dirname, '../../data/observations.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await this.observationModel.deleteMany(); // Clears existing records
    await this.observationModel.insertMany(data);
    this.logger.log('✅ Observations seeded successfully');
  }
}
EOF

# Create and write Patient Seeder
cat > $SEEDER_DIR/patient.seed.ts <<EOF
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.seedPatients();
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Error seeding patients:', error);
  process.exit(1);
});
EOF

# Create and write Observation Seeder
cat > $SEEDER_DIR/observation.seed.ts <<EOF
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.seedObservations();
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Error seeding observations:', error);
  process.exit(1);
});
EOF

# Create and write General Seeder
cat > $SEEDER_DIR/seed.ts <<EOF
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  console.log('🌱 Seeding data...');

  await seedService.seedPatients();
  await seedService.seedObservations();

  console.log('✅ Database seeding complete!');
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Error running seeders:', error);
  process.exit(1);
});
EOF

# Create sample data files in data directory
cat > $DATA_DIR/patients.json <<EOF
[
  {
    "id": "1",
    "nhsNumber": "1111111111",
    "firstName": "Zahid",
    "lastName": "Smith",
    "gender": "male",
    "birthDate": "1946-02-12",
    "phone": "0700 000 0000",
    "address": "49 Park Court, Milton Keynes, Hertfordshire, W6 9JF"
  },
  {
    "id": "2",
    "nhsNumber": "1111111112",
    "firstName": "Eileen",
    "lastName": "Smith",
    "gender": "female",
    "birthDate": "2003-02-16",
    "phone": "05361052321",
    "address": "71 St. John's Road, Dover, West Yorkshire, LS29 7LL"
  }
]
EOF

cat > $DATA_DIR/observations.json <<EOF
[
  {
    "id": "1",
    "status": "final",
    "code": "Migraine",
    "issued": "2015-03-24T00:00:00+00:00",
    "patientId": "1"
  },
  {
    "id": "2",
    "status": "final",
    "code": "Type II diabetes mellitus with persistent microalbuminuria",
    "issued": "2020-08-07T00:00:00+00:00",
    "patientId": "1"
  },
  {
    "id": "3",
    "status": "final",
    "code": "Serum vitamin B12 level",
    "issued": "2018-05-31T16:01:40+00:00",
    "patientId": "2"
  },
  {
    "id": "4",
    "status": "final",
    "code": "Recurrent major depressive episodes, unspecified",
    "issued": "2013-08-04T01:00:00+01:00",
    "patientId": "2"
  },
  {
    "id": "5",
    "status": "final",
    "code": "Stroke of uncertain pathology",
    "issued": "2014-03-05T00:00:00+00:00",
    "patientId": "2"
  }
]
EOF

echo "✅ Seeder setup complete! Run 'npm run seed' to seed the database."