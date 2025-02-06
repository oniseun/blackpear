import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Coding {
  @Prop({ required: true })
  system: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  display?: string;
}

class Code {
  @Prop({ type: [Coding], required: true })
  coding: Coding[];

  @Prop()
  text?: string;
}

class ValueQuantity {
  @Prop({ required: true })
  value: number;

  @Prop()
  unit?: string;
}

class Subject {
  @Prop({ required: true })
  reference: string;
}

@Schema()
export class Observation extends Document {
  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true, unique: true, type: Number })
  id: number;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Code, required: true })
  code: Code;

  @Prop({ type: Date, required: true })
  issued: Date;

  @Prop({ type: Subject, required: true })
  subject: Subject;

  @Prop()
  comment?: string;

  @Prop({ type: ValueQuantity })
  valueQuantity?: ValueQuantity;
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);
