import { WithId } from 'mongodb';

import { IBlogDb } from '../db/db.types';
import { converterBlog } from '../helpers/converterToValidFormatData/converter.blog';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';
import { BlogRepo } from '../repositories/blogs/blog.repo';

export class BlogService {
  constructor(protected blogRepo: BlogRepo) {}

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogViewModel | null> {
    const newBlog: IBlogDb = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const result = await this.blogRepo.createBlog(newBlog);

    return result ? converterBlog(result) : null;
  }

  async updateBlog(
    id: string,
    body: BlogInputModel
  ): Promise<WithId<IBlogDb> | null> {
    const { name, description, websiteUrl } = body;

    return await this.blogRepo.updateBlog({
      id,
      name,
      description,
      websiteUrl,
    });
  }

  async deleteBlog(id: string): Promise<WithId<IBlogDb> | null> {
    return await this.blogRepo.deleteBlog(id);
  }
}
