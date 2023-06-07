import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { MongoId } from '../../../types/mongo._id.interface';
import { WithPagination } from '../../../types/pagination.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { Blog } from '../blogs.schema';
import { BlogViewBySADto, BlogViewDto } from '../dto/view/blog.view.dto';

@Injectable()
export class BlogsQueryRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getAllBlogs(
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewDto>> {
    const { searchNameTerm } = pagination;

    const filter = { name: { $regex: searchNameTerm, $options: 'i' } };

    return await this._getBlogs(filter, pagination);
  }

  async getAllBlogsByUserId(
    userId: MongoId,
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewDto>> {
    const { searchNameTerm } = pagination;

    const filter = { name: { $regex: searchNameTerm, $options: 'i' }, userId };

    return await this._getBlogs(filter, pagination);
  }

  async getAllBlogsBySA(
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewBySADto>> {
    const { searchNameTerm, sortBy, sortDirection, pageSize, pageNumber } =
      pagination;

    const filter = { name: { $regex: searchNameTerm, $options: 'i' } };

    const blogs = await this.blogModel
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'users',
            let: { userId: { $toObjectId: '$userId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              { $project: { _id: 1, userLogin: '$accountData.login' } },
            ],
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $group: {
            _id: '$_id',
            userId: { $first: '$userId' },
            userLogin: { $first: '$user.userLogin' },
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $addFields: {
            'doc.blogOwnerInfo': {
              userId: '$userId',
              userLogin: '$userLogin',
            },
          },
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $set: { id: '$_id' } },
        { $project: { __v: 0, user: 0, userId: 0, _id: 0 } },
      ])
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: blogs,
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewDto | false> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.findById(convertId).lean();

    return !blog ? false : this._blogMapping(blog);
  }

  private async _getBlogs(
    filter: Record<string, unknown>,
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    return await this._getBlogs(filter, pagination);
  }

  async getBlogById(blogId: string): Promise<BlogViewDto | false> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.findById(convertId).lean();

    return !blog ? false : this._blogMapping(blog);
  }

  private async _getBlogs(
    filter: Record<string, unknown>,
    pagination: BlogQueryPagination,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const blogs = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.blogModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: blogs.map(this._blogMapping),
    };
  }

  private _blogMapping(blog: DbType<Blog>): BlogViewDto {
    const { _id, createdAt, description, isMembership, name, websiteUrl } =
      blog;

    return {
      id: _id.toString(),
      name,
      description,
      websiteUrl,
      isMembership,
      createdAt: createdAt.toISOString(),
    };
  }
}
