import { Controller, Get, Query } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getPatient(@Query('nhsNumber') nhsNumber: string, @Query('lastName') lastName: string) {
    if (nhsNumber) return this.patientService.getPatientByNhsNumber(nhsNumber);
    if (lastName) return this.patientService.getPatientsByLastName(lastName);
    return { message: 'Provide nhsNumber or lastName' };
  }
}
