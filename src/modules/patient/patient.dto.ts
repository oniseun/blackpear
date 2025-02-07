import { ApiProperty } from '@nestjs/swagger';
import { Patient } from './patient.schema';

class IdentifierDto {
  @ApiProperty({
    example: 'NHS',
    description: 'Label for the identifier (if applicable)',
  })
  label?: string;

  @ApiProperty({
    example: 'https://fhir.nhs.uk/Id/nhs-number',
    description: 'The system that issued the identifier',
  })
  system: string;

  @ApiProperty({
    example: '1111111112',
    description: 'The NHS number as a string',
  })
  value: string;
}

class NameDto {
  @ApiProperty({
    example: 'official',
    description: 'The type of name use (e.g., official, maiden, usual)',
  })
  use?: string;

  @ApiProperty({
    example: 'Mr Zahid Smith',
    description: 'Full name as a single string',
  })
  text: string;

  @ApiProperty({ example: 'Smith', description: 'Family (last) name' })
  family: string;

  @ApiProperty({
    example: ['Zahid'],
    description: 'Given (first and middle) names',
  })
  given: string[];

  @ApiProperty({
    example: ['Mr'],
    description: 'Prefixes like Mr, Miss, Dr, etc.',
  })
  prefix?: string[];
}

class TelecomDto {
  @ApiProperty({
    example: 'phone',
    description: 'Type of contact (e.g., phone, email)',
  })
  system: string;

  @ApiProperty({
    example: '0700 000 0000',
    description: 'Contact value (phone number or email)',
  })
  value: string;

  @ApiProperty({
    example: 'mobile',
    description: 'Use of the contact (home, work, mobile, etc.)',
  })
  use?: string;
}

class AddressDto {
  @ApiProperty({
    example: 'home',
    description: 'The type of address use (e.g., home, work)',
  })
  use?: string;

  @ApiProperty({
    example:
      "71 St. John's Road, Dover, Moselden Height, West Yorkshire, LS29 7LL",
    description: 'Full address as a single string',
  })
  text: string;

  @ApiProperty({
    example: 'Moselden Height',
    description: 'City or locality of the address',
  })
  city?: string;

  @ApiProperty({ example: 'West Yorkshire', description: 'State or region' })
  state?: string;

  @ApiProperty({ example: 'LS29 7LL', description: 'Postal code' })
  postalCode?: string;
}

export class PatientDto {
  @ApiProperty({
    example: 'Patient',
    description: 'FHIR resource type, always "Patient"',
  })
  resourceType: string;

  @ApiProperty({ example: 1, description: 'Unique identifier for the patient' })
  id: number;

  @ApiProperty({
    type: [IdentifierDto],
    description: 'List of patient identifiers (e.g., NHS Number)',
  })
  identifier: IdentifierDto[];

  @ApiProperty({
    type: [NameDto],
    description: 'List of names associated with the patient',
  })
  name: NameDto[];

  @ApiProperty({
    type: [TelecomDto],
    description: 'Contact details (phone, email, etc.)',
  })
  telecom?: TelecomDto[];

  @ApiProperty({
    example: 'male',
    enum: ['male', 'female', 'other', 'unknown'],
    description: 'Gender of the patient',
  })
  gender: 'male' | 'female' | 'other' | 'unknown';

  @ApiProperty({
    example: '1946-02-12',
    description: 'Patient birth date (YYYY-MM-DD)',
    type: String,
  })
  birthDate?: string;

  @ApiProperty({ type: [AddressDto], description: 'List of patient addresses' })
  address?: AddressDto[];

  static fromEntity(patient: Patient): PatientDto {
    return {
      resourceType: patient.resourceType,
      id: patient.id,
      identifier:
        patient.identifier?.map((id) => ({
          label: id.label,
          system: id.system,
          value: id.value,
        })) || [],
      name:
        patient.name?.map((name) => ({
          use: name.use,
          text: name.text,
          family: name.family,
          given: name.given,
          prefix: name.prefix,
        })) || [],
      telecom:
        patient.telecom?.map((contact) => ({
          system: contact.system,
          value: contact.value,
          use: contact.use,
        })) || [],
      gender: patient.gender,
      birthDate: patient.birthDate
        ? patient.birthDate.toISOString().split('T')[0]
        : undefined,
      address:
        patient.address?.map((addr) => ({
          use: addr.use,
          text: addr.text,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
        })) || [],
    };
  }
}
