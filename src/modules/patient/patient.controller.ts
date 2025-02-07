import {
  Controller,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { PatientDto } from './patient.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOperation({
    summary: 'Find a patient by NHS Number or Last Name',
    description:
      'Search for a patient using either an NHS Number (when label is "NHS") or a last name.',
  })
  @ApiQuery({
    name: 'nhsNumber',
    required: false,
    description: 'The NHS number of the patient .',
    example: 1111111112,
  })
  @ApiQuery({
    name: 'surname',
    required: false,
    description: 'The last name (surname) of the patient.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of patients matching the NHS Number or last name.',
    type: [PatientDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Either nhsNumber or surname is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'No patients found matching the search criteria.',
  })
  async getPatient(
    @Query('nhsNumber') nhsNumber?: string,
    @Query('surname') surname?: string,
  ): Promise<PatientDto[]> {
    if (!nhsNumber && !surname) {
      throw new BadRequestException(
        'Either nhsNumber or surname must be provided.',
      );
    }
    if (nhsNumber && surname) {
      throw new BadRequestException(
        'Only one of nhsNumber or surname must be provided.',
      );
    }

    let patients = [];

    if (nhsNumber) {
      patients = await this.patientService.getPatientByNhsNumber(nhsNumber);
    } else if (surname) {
      patients = await this.patientService.getPatientsBySurname(surname);
    }

    if (!patients.length) {
      throw new NotFoundException(
        'No patients found matching the search criteria.',
      );
    }

    return patients.map(PatientDto.fromSchema);
  }
}
