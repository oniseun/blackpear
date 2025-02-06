import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true })
  nhsNumber: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  birthDate: string;

  @Prop()
  phone: string;

  @Prop()
  email?: string;

  @Prop()
  address: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
