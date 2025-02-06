import { Injectable } from '@nestjs/common';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getPatientByNhsNumber(nhsNumber: string) {
    return this.patientRepository.findByNhsNumber(nhsNumber);
  }

  async getPatientsByLastName(lastName: string) {
    return this.patientRepository.findByLastName(lastName);
  }
}
