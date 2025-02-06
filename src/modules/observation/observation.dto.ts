import { ApiProperty } from '@nestjs/swagger';
import { Observation } from './observation.schema';

class CodingDto {
  @ApiProperty({
    example: 'http://read.info/readv2',
    description: 'System identifier for the coding.',
  })
  system: string;

  @ApiProperty({
    example: 'F26..',
    description: 'Code representing the observation.',
  })
  code: string;

  @ApiProperty({
    example: 'Migraine',
    description: 'Human-readable description of the code.',
  })
  display?: string;
}

class CodeDto {
  @ApiProperty({
    type: [CodingDto],
    description: 'List of coding details for the observation.',
  })
  coding: CodingDto[];

  @ApiProperty({
    example: 'Migraine',
    description: 'Text representation of the observation.',
  })
  text?: string;
}

class ValueQuantityDto {
  @ApiProperty({
    example: 950,
    description: 'The numerical value of the observation.',
  })
  value: number;

  @ApiProperty({
    example: 'ng/L',
    description: 'The unit of measurement for the value.',
  })
  unit?: string;
}

class SubjectDto {
  @ApiProperty({
    example: 'Patient/1',
    description: 'FHIR-style reference to the patient.',
  })
  reference: string;
}

export class ObservationDto {
  @ApiProperty({
    example: 'Observation',
    description: 'FHIR resource type, always "Observation".',
  })
  resourceType: string;

  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the observation.',
  })
  id: number;

  @ApiProperty({ example: 'final', description: 'Status of the observation.' })
  status: string;

  @ApiProperty({
    type: CodeDto,
    description: 'Details of the observation code and coding.',
  })
  code: CodeDto;

  @ApiProperty({
    example: '2015-03-24T00:00:00+00:00',
    description: 'Date and time when the observation was issued.',
  })
  issued: string;

  @ApiProperty({
    type: SubjectDto,
    description: 'Reference to the associated patient.',
  })
  subject: SubjectDto;

  @ApiProperty({
    example: 'Data entered as CTV3',
    required: false,
    description: 'Additional comments on the observation.',
  })
  comment?: string;

  @ApiProperty({
    type: ValueQuantityDto,
    required: false,
    description:
      'Numeric value associated with the observation (if applicable).',
  })
  valueQuantity?: ValueQuantityDto;

  static fromEntity(observation: Observation): ObservationDto {
    return {
      resourceType: observation.resourceType,
      id: observation.id,
      status: observation.status,
      code: {
        coding: observation.code.coding.map((coding) => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
        text: observation.code.text,
      },
      issued: observation.issued.toISOString(),
      subject: { reference: observation.subject.reference },
      comment: observation.comment,
      valueQuantity: observation.valueQuantity
        ? {
            value: observation.valueQuantity.value,
            unit: observation.valueQuantity.unit,
          }
        : undefined,
    };
  }
}
