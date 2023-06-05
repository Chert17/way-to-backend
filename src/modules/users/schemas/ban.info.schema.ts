import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, id: false, versionKey: false })
export class BanInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String, default: null })
  banReason: string | null;

  @Prop({ type: Date, default: null })
  banDate: Date | null;
}

export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);
