import { ObjectId, WithId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { IPostDb } from '../../db/db.types';
import { PostInputModelDb } from './post.repo.types';

export const postRepo = {
  createPost: async (post: IPostDb): Promise<ObjectId | null> => {
    try {
      const result = await postsDbCollection.insertOne(post);

      if (!result.acknowledged) return null;

      return result.insertedId;
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

      const result = await postsDbCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { blogId, content, shortDescription, title } },
        { returnDocument: 'after' }
      );

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },

  deletePost: async (id: string): Promise<WithId<IPostDb> | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      const result = await postsDbCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },
};
