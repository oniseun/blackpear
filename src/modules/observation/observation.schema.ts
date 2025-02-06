import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Model } from 'mongoose';
import { Patient } from '../patient/patient.schema';

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
  @Prop({ required: true, default: 'Observation' })
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

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: false })
  patient?: Types.ObjectId;

  @Prop()
  comment?: string;

  @Prop({ type: ValueQuantity })
  valueQuantity?: ValueQuantity;
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);

ObservationSchema.pre<Observation>('save', async function (next) {
  const subjectRef = this.subject?.reference;

  if (!subjectRef) {
    return next(new Error('subject.reference is required.'));
  }

  const [resourceType, id] = subjectRef.split('/');

  if (!resourceType || !id || isNaN(Number(id))) {
    return next(
      new Error(
        'Invalid subject reference format. Expected "{ResourceType}/{id}".',
      ),
    );
  }

  // Map of supported entities
  const entityMap = {
    '`Patient`': Patient,
  };

  if (!entityMap[resourceType]) {
    return next(
      new Error(
        `Invalid resource type: ${resourceType}. Allowed types: ${Object.keys(
          entityMap,
        ).join(', ')}`,
      ),
    );
  }

  const entityModel = entityMap[resourceType] as Model<any>;

  const existingEntity = await entityModel.findOne({ id: Number(id) }).exec();
  if (!existingEntity) {
    return next(
      new Error(`Referenced ${resourceType} with id ${id} does not exist.`),
    );
  }

  if (resourceType === 'Patient') {
    this.patient = existingEntity._id;
  }

  next();
});
