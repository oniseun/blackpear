import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Identifier {
  @Prop()
  label?: string;

  @Prop({ required: true })
  system: string;

  @Prop({ required: true, type: Number })
  value: number;
}

class Name {
  @Prop()
  use?: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  family: string;

  @Prop({ type: [String], required: true })
  given: string[];

  @Prop({ type: [String] })
  prefix?: string[];
}

class Telecom {
  @Prop({ required: true })
  system: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  use?: string;
}

class Address {
  @Prop()
  use?: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  postalCode?: string;
}

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true, unique: true, type: Number })
  id: number;

  @Prop({ type: [Identifier], required: true })
  identifier: Identifier[];

  @Prop({ type: [Name], required: true })
  name: Name[];

  @Prop({ type: [Telecom] })
  telecom?: Telecom[];

  @Prop({ required: true, enum: ['male', 'female', 'other', 'unknown'] })
  gender: 'male' | 'female' | 'other' | 'unknown';

  @Prop({ type: Date })
  birthDate?: Date;

  @Prop({ type: [Address] })
  address?: Address[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
