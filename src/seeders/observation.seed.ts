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
