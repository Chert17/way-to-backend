import { Model } from 'mongoose';
import { DbType } from 'src/types/db.interface';
import { tryConvertToObjectId } from 'src/utils/converter.object.id';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Blog } from '../blogs.schema';
import { CreateBlogDto } from '../dto/input/create.blog.dto';
import { UpdateBlogDto } from '../dto/input/update.blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(dto: CreateBlogDto): Promise<DbType<Blog>> {
    return await this.blogModel.create(dto);
  }

  async updateBlog(dto: UpdateBlogDto): Promise<boolean> {
    const { blogId, description, name, websiteUrl } = dto;

    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.updateOne(
      { _id: convertId },
      { description, name, websiteUrl },
      { returnDocument: 'after' },
    );

    return blog.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.deleteOne({ _id: convertId });

    return blog.deletedCount === 1;
  }

  async checkBlogById(blogId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.countDocuments({ _id: convertId });

    return !!blog;
  }
}
