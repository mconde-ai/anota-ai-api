import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AccessCounter extends Document {
  @Prop({ required: true, default: 'site_access' })
  identifier: string;

  @Prop({ required: true, default: 0 })
  count: number;
}

export const AccessCounterSchema = SchemaFactory.createForClass(AccessCounter);