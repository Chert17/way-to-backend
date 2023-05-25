import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Comment } from '../comments.schema';

@Injectable()
export class CommentsRepo {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createComment(newComment: Comment) {
    return await this.commentModel.create(newComment);
  }
}
