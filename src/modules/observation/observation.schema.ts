import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Observation extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  issued: string;

  @Prop({ required: true })
  patientId: string;
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);
