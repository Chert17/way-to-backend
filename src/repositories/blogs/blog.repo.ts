import { ObjectId, WithId } from 'mongodb';

import { IBlogDb } from '../../db/db.types';
import { BlogModel } from '../../db/schema-model/blog.schema.model';
import { BlogInputModelDb } from './blog.repo.types';

export const blogRepo = {
  createBlog: async (blog: IBlogDb): Promise<WithId<IBlogDb> | null> => {
    try {
      return await BlogModel.create(blog);
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

      return await BlogModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, description, websiteUrl } },
        { returnDocument: 'after' }
      );
    } catch (error) {
      return null;
    }
  },

  deleteBlog: async (id: string): Promise<WithId<IBlogDb> | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      return await BlogModel.findOneAndDelete({
        _id: new ObjectId(id),
      });
    } catch (error) {
      return null;
    }
  },
};
