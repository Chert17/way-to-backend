import { WithId } from 'mongodb';

import { IBlogDb } from '../db/db.types';
import { converterBlog } from '../helpers/converterToValidFormatData/converter.blog';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';
import { blogRepo } from '../repositories/blogs/blog.repo';

export const blogService = {
  createBlog: async (
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogViewModel | null> => {
    const newBlog: IBlogDb = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await blogRepo.createBlog(newBlog);

    return result ? converterBlog({ ...newBlog, _id: result }) : null;
  },

  updateBlog: async (
    id: string,
    body: BlogInputModel
  ): Promise<WithId<IBlogDb> | null> => {
    const { name, description, websiteUrl } = body;

    return await blogRepo.updateBlog({
      id,
      name,
      description,
      websiteUrl,
    });
  },

  deleteBlog: async (id: string): Promise<WithId<IBlogDb> | null> => {
    return await blogRepo.deleteBlog(id);
  },
};
