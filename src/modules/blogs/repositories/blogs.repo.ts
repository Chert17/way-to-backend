import { Model, Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { MongoId } from '../../../types/mongo._id.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { Blog } from '../blogs.schema';
import { CreateBlogDbDto } from '../dto/input/create.blog.dto';
import { UpdateBlogDbDto } from '../dto/input/update.blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(dto: CreateBlogDbDto): Promise<MongoId> {
    const result = await this.blogModel.create(dto);

    return result._id;
  }

  async updateBlog(dto: UpdateBlogDbDto): Promise<boolean> {
    const { description, name, websiteUrl, blogId } = dto;

    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.updateOne(
      { _id: convertId },
      { description, name, websiteUrl },
    );

    return blog.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.deleteOne({ _id: convertId });

    return blog.deletedCount === 1;
  }

  async getBlogName(blogId: string): Promise<string> {
    const blog = await this.blogModel
      .findById(
        { _id: new Types.ObjectId(blogId) },
        {},
        { projection: { name: true } },
      )
      .lean();

    return blog.name;
  }

  async checkBlogById(blogId: string): Promise<DbType<Blog> | false> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.findById({ _id: convertId });

    return blog;
  }
}
