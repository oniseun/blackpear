import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  @Prop({ required: true, default: 'Patient' })
  resourceType: string;

  @Prop({ required: true, unique: true, type: Number, index: true })
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Observation' }], default: [] })
  observations?: Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      const patient = this as any;
      const ObservationModel = patient.model('Observation');
      await ObservationModel.deleteMany({ patient: patient._id }).exec();
      next();
    } catch (error) {
      next(error);
    }
  },
);

PatientSchema.pre('deleteMany', async function (next) {
  try {
    const query = this as any;
    const filter = query.getFilter();
    const PatientModel = query.model;
    const patients = await PatientModel.find(filter).exec();
    if (!patients.length) {
      return next();
    }
    const ObservationModel = query.model('Observation');
    const patientIds = patients.map((patient) => patient._id);
    await ObservationModel.deleteMany({ patient: { $in: patientIds } }).exec();
    next();
  } catch (error) {
    next(error);
  }
});
