import { Injectable } from '@nestjs/common';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getPatientByNhsNumberOrSurname(searchValue: string) {
    return this.patientRepository.findByNhsNumberOrSurname(searchValue);
  }
}
