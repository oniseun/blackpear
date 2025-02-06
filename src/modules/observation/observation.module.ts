import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Observation, ObservationSchema } from './observation.schema';
import { ObservationRepository } from './observation.repository';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  controllers: [ObservationController],
  providers: [ObservationService, ObservationRepository],
})
export class ObservationModule {}
