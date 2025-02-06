import { Controller, Get, Query } from '@nestjs/common';
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
    name: 'search',
    required: true,
    description: 'Either an NHS Number (numeric) or a last name (string).',
    example: '1111111112 or Smith',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of patients matching the NHS Number or last name.',
    type: [PatientDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Missing or invalid search parameter.',
  })
  async getPatient(@Query('search') search: string): Promise<PatientDto[]> {
    if (!search) {
      return [
        {
          message: 'Provide a search term (NHS Number or Last Name)',
        } as unknown as PatientDto,
      ];
    }
    const patients = await this.patientService.getPatientByNhsNumberOrSurname(
      search,
    );
    return patients.map(PatientDto.fromEntity);
  }
}
