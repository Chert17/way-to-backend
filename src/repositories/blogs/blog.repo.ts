import { ObjectId, WithId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { IBlogDb } from '../../db/db.types';
import { BlogInputModelDb } from './blog.repo.types';

export const blogRepo = {
  createBlog: async (blog: IBlogDb): Promise<ObjectId | null> => {
    try {
      const result = await blogsDbCollection.insertOne(blog);

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },

  updateBlog: async (
    blog: BlogInputModelDb
  ): Promise<WithId<IBlogDb> | null> => {
    try {
      const { name, description, websiteUrl, id } = blog;

      if (!ObjectId.isValid(id)) return null;

      const result = await blogsDbCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, description, websiteUrl } },
        { returnDocument: 'after' }
      );

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },

  deleteBlog: async (id: string): Promise<WithId<IBlogDb> | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      const result = await blogsDbCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },
};
