import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LikeStatus } from '../../utils/like.status';

export type PostDocument = HydratedDocument<Post>;

@Schema({ _id: false, versionKey: false, timestamps: true })
export class PostLikeInfo {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ required: true, type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String, enum: LikeStatus, require: true })
  status: LikeStatus;

  @Prop({ type: String, require: true })
  userLogin: string;

  createdAt?: Date;

  updatedAt?: Date;
}

const PostLikeInfoSchema = SchemaFactory.createForClass(PostLikeInfo);

@Schema({ versionKey: false })
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

  @Prop({ type: [PostLikeInfoSchema], require: true })
  extendedLikesInfo: PostLikeInfo[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
