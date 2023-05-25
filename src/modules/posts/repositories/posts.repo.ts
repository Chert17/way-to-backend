import { Model } from 'mongoose';
import { DbType } from 'src/types/db.interface';
import { tryConvertToObjectId } from 'src/utils/converter.object.id';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { createPostDto } from '../dto/input/create.post.dto';
import { updatePostDto } from '../dto/input/update.post.dto';
import { Post } from '../posts.schema';

@Injectable()
export class PostsRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: createPostDto): Promise<DbType<Post>> {
    return await this.postModel.create(dto);
  }

  async updatePost(dto: updatePostDto): Promise<boolean> {
    const { postId, blogId, content, shortDescription, title } = dto;

    const convertId = tryConvertToObjectId(postId);

    if (!convertId) return false;

    const post = await this.postModel.updateOne(
      { _id: convertId },
      { blogId, content, shortDescription, title },
      { returnDocument: 'after' },
    );

    return post.matchedCount === 1;
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
