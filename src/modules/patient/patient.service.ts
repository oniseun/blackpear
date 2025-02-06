import { Injectable } from '@nestjs/common';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getPatientByNhsNumber(nhsNumber: number) {
    return this.patientRepository.findByNhsNumber(nhsNumber);
  }

  async getPatientsBySurname(surname: string) {
    return this.patientRepository.findBySurname(surname);
  }
}
