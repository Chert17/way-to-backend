import { ObjectId, WithId } from 'mongodb';

import { IPostDb } from '../../db/db.types';
import { PostModel } from '../../db/schema-model/post.schema.model';
import { PostInputModelDb } from './post.repo.types';

export const postRepo = {
  createPost: async (post: IPostDb): Promise<WithId<IPostDb> | null> => {
    try {
      return await PostModel.create(post);
    } catch (error) {
      return null;
    }
  },

  updatePost: async (
    post: PostInputModelDb
  ): Promise<WithId<IPostDb> | null> => {
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
  },

  deletePost: async (id: string): Promise<WithId<IPostDb> | null> => {
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
  },
};
