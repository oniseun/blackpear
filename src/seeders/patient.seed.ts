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
