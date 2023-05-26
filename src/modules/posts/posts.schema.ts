import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LikeStatus } from '../../utils/like.status';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
class PostLikeInfoSchema {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ type: String, enum: LikeStatus, require: true })
  status: string;

  @Prop({ type: String, require: true })
  login: string;
}

@Schema()
export class Post {
  @Prop({ type: String, require: true, length: { max: 30 } })
  title: string;

  @Prop({ type: String, require: true, length: { max: 100 } })
  shortDescription: string;

  @Prop({ type: String, require: true, length: { min: 20, max: 1000 } })
  content: string;

  @Prop({ type: String, require: true })
  blogId: string;

  @Prop({ type: String, require: true })
  blogName: string;

  @Prop({ type: Date, require: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Array, require: true, default: [] })
  extendedLikesInfo: [PostLikeInfoSchema];
}

export const PostSchema = SchemaFactory.createForClass(Post);
