import { Model, ObjectId } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
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

  async getAndCheckBlogName(blogId: string) {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel
      .findById({ _id: convertId }, {}, { projection: { name: true } })
      .lean();

    return !blog ? false : blog;
  }

  async checkBlogById(blogId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.countDocuments({ _id: convertId });

    return !!blog;
  }
}
