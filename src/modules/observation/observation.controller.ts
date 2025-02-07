import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObservationService } from './observation.service';
import { ObservationDto } from './observation.dto';

@ApiTags('Observations')
@Controller('observations')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve observations for a specific patient',
    description:
      'Returns a list of observations associated with a given patient ID.',
  })
  @ApiQuery({
    name: 'patientId',
    required: true,
    description:
      'The ID of the patient whose observations are being retrieved.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of observations successfully retrieved.',
    type: [ObservationDto],
  })
  @ApiResponse({
    status: 204,
    description: 'No observations found for the given patient.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Missing or invalid patientId parameter.',
  })
  @HttpCode(200)
  async getObservations(
    @Query('patientId', ParseIntPipe) patientId: number,
  ): Promise<ObservationDto[]> {
    if (!patientId) {
      throw new BadRequestException('patientId is required.');
    }

    const observations =
      await this.observationService.getObservationsByPatientId(patientId);

    if (!observations.length) {
      return [];
    }

    return observations.map(ObservationDto.fromSchema);
  }
}
