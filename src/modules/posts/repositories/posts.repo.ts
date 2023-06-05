import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MongoId } from '../../../types/mongo._id.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { PostsLikeStatusDbDto } from '../dto/db/like.status.db.dto';
import { createPostDbDto } from '../dto/input/create.post.dto';
import { updatePostDto } from '../dto/input/update.post.dto';
import { Post } from '../posts.schema';

@Injectable()
export class PostsRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: createPostDbDto): Promise<MongoId> {
    const result = await this.postModel.create(dto);

    return result._id;
  }

  async updatePost(dto: updatePostDto, postId: string): Promise<boolean> {
    const { blogId, content, shortDescription, title } = dto;

    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const post = await this.postModel.updateOne(
      { _id: convertId },
      { blogId, content, shortDescription, title },
      { returnDocument: 'after' },
    );

    return post.matchedCount === 1;
  }

  async updatePostLikeStatus(dto: PostsLikeStatusDbDto): Promise<void> {
    const { postId, likeStatus, userId, userLogin } = dto;

    const post = await this.postModel.findById(postId);

    const likeInfo = post.extendedLikesInfo.find(i => i.userId === userId);

    if (!likeInfo) {
      post.extendedLikesInfo.push({ userId, userLogin, status: likeStatus });
    } else likeInfo.status = likeStatus;

    post.save();
  }

  async deletePost(postId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const result = await this.postModel.deleteOne({ _id: convertId });

    return result.deletedCount === 1;
  }

  async checkPostById(postId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const post = await this.postModel.countDocuments({ _id: convertId });

    return !!post;
  }
}
