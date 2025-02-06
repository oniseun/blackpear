import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './observation.repository';

@Injectable()
export class ObservationService {
  constructor(private readonly observationRepository: ObservationRepository) {}

  async getObservationsByPatientId(patientId: number) {
    return this.observationRepository.findByPatientId(patientId);
  }
}
