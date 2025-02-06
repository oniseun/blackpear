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
