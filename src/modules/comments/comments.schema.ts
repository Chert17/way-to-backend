import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LikeStatus } from '../../utils/like.status';

export type BlogDocument = HydratedDocument<Comment>;

@Schema()
class CommentatorInfo {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ type: String, require: true })
  userLogin: string;
}

@Schema({ timestamps: true })
class LikesInfo {
  @Prop({ type: String, require: true })
  userId: string;

  @Prop({ type: String, enum: LikeStatus, require: true })
  status: LikeStatus;
}

@Schema()
export class Comment {
  @Prop({ type: String, require: true })
  postId: string;

  @Prop({ type: String, require: true, length: { max: 300 } })
  content: string;

  @Prop({ type: Date, require: true, default: Date.now })
  createdAt: string;

  @Prop({ type: Object, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Array, required: true })
  likesInfo: [LikesInfo];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
