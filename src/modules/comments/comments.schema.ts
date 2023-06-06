import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LikeStatus } from '../../utils/like.status';

export type BlogDocument = HydratedDocument<Comment>;

@Schema({ _id: false, id: false, versionKey: false })
class CommentatorInfo {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ type: String, require: true })
  userLogin: string;

  @Prop({ required: true, type: Boolean })
  isBanned: boolean;
}

export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema({ timestamps: true, _id: false, id: false, versionKey: false })
class LikesInfo {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ required: true, type: Boolean })
  isBanned: boolean;

  @Prop({ type: String, enum: LikeStatus, require: true })
  status: LikeStatus;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema()
export class Comment {
  @Prop({ type: String, require: true })
  postId: string;

  @Prop({ type: String, require: true, length: { max: 300 } })
  content: string;

  @Prop({ type: Date, require: true, default: Date.now })
  createdAt: string;

  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: [LikesInfoSchema], required: true })
  likesInfo: LikesInfo[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
