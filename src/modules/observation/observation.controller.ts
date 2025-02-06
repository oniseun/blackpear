import { Controller, Get, Param } from '@nestjs/common';
import { ObservationService } from './observation.service';

@Controller('observations')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Get(':patientId')
  async getObservations(@Param('patientId') patientId: string) {
    return this.observationService.getObservationsByPatientId(patientId);
  }
}
