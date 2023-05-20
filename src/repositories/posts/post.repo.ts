import { ObjectId, WithId } from 'mongodb';

import { IPostDb, IPostsLikesInfoDb } from '../../db/db.types';
import { PostModel } from '../../db/schema-model/post.schema.model';
import { LikeStatus } from '../../models/likes.models';
import { PostInputModelDb } from './post.repo.types';

export class PostRepo {
  async createPost(post: IPostDb): Promise<WithId<IPostDb> | null> {
    try {
      return await PostModel.create(post);
    } catch (error) {
      return null;
    }
  }

  async updatePost(post: PostInputModelDb): Promise<WithId<IPostDb> | null> {
    try {
      const { id, blogId, content, shortDescription, title } = post;

      if (!ObjectId.isValid(id)) return null;

      const result = await PostModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { blogId, content, shortDescription, title } },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async updatePostLikeInfo(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
    login: string
  ): Promise<void | null> {
    try {
      if (!ObjectId.isValid(postId)) return null;

      const post = await PostModel.findById(postId);

      if (!post) return null;

      const postInstance = new PostModel(post);
      const { extendedLikesInfo } = postInstance;

      this._checkAndChangeLikeStatus(
        extendedLikesInfo,
        likeStatus,
        userId,
        login
      );

      await postInstance.save();
    } catch (error) {
      return null;
    }
  }

  async deletePost(id: string): Promise<WithId<IPostDb> | null> {
    try {
      if (!ObjectId.isValid(id)) return null;

      const result = await PostModel.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  private _checkAndChangeLikeStatus(
    likesInfo: IPostsLikesInfoDb[],
    inputStatus: LikeStatus,
    userId: string,
    login: string
  ) {
    const existingLike = likesInfo.find(i => i.userId === userId);

    if (!existingLike) {
      return likesInfo.unshift({ userId, login, status: inputStatus });
    }

    if (existingLike.status === inputStatus) return;

    return (existingLike.status = inputStatus);
  }
}
