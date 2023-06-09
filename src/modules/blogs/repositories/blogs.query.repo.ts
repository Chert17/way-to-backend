import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { MongoId } from '../../../types/mongo._id.interface';
import { WithPagination } from '../../../types/pagination.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import {
  BlogQueryPagination,
  DefaultPagination,
} from '../../../utils/pagination/pagination';
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
        { $project: { __v: 0, user: 0, userId: 0, _id: 0, bannedUsers: 0 } },
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

  async getAllBanUsersByBloggerBlog(
    userId: string,
    blogId: string,
    pagination: BlogQueryPagination,
  ) {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      pagination;

    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const filter = {
      _id: convertId,
      name: { $regex: searchNameTerm, $options: 'i' },
    };

    const result = await this.blogModel
      .aggregate([
        { $match: filter },
        { $unwind: '$bannedUsers' },
        {
          $lookup: {
            from: 'users',
            let: { id: { $toObjectId: '$bannedUsers.banUserId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
              { $project: { login: '$accountData.login' } },
            ],
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            id: { $toString: '$bannedUsers.banUserId' },
            login: '$user.login',
            banInfo: {
              isBanned: '$bannedUsers.isBanned',
              banDate: '$bannedUsers.banDate',
              banReason: '$bannedUsers.banReason',
            },
          },
        },
      ])
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize);

    const blog = await this.blogModel.findOne(filter);

    if (!blog) return false;

    const totalCount = blog.bannedUsers.length;
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount: totalCount,
      items: result,
    };
  }

  async getAllCommentsByBloggerBlog(
    userId: MongoId,
    pagination: DefaultPagination,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.blogModel
      .aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'posts',
            let: { id: { $toString: '$_id' } },
            pipeline: [{ $match: { $expr: { $eq: ['$blogId', '$$id'] } } }],
            as: 'post',
          },
        },
        { $unwind: '$post' },
        {
          $lookup: {
            from: 'comments',
            let: { postId: { $toString: '$post._id' } },
            pipeline: [{ $match: { $expr: { $eq: ['$postId', '$$postId'] } } }],
            as: 'comment',
          },
        },
        { $unwind: '$comment' },
        {
          $project: {
            id: { $toString: '$commnet._id' },
            content: '$comment.content',
            commentatorInfo: {
              userId: '$comment.commentatorInfo.userId',
              userLogin: '$comment.commentatorInfo.userLogin',
            },
            createdAt: '$comment.createdAt',
            postInfo: {
              id: { $toString: '$post._id' },
              title: '$post.title',
              blogId: '$post.blogId',
              blogName: '$post.blogName',
            },
            commentCount: { $size: '$comment' },
          },
        },
      ])
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize);

    const pageCount = Math.ceil(result[0].commentCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount: result[0].commentCount,
      items: result.map(item => ({
        id: item.id,
        content: item.content,
        commentatorInfo: item.commentatorInfo,
        createdAt: item.createdAt,
        postInfo: item.postInfo,
      })),
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewDto | false> {
    const convertId = tryConvertToObjectId(blogId);

    if (!convertId) return false;

    const blog = await this.blogModel.findById(convertId).lean();

    if (!blog) return false;
    
    if (blog.banInfo.isBanned) return false;

    return this._blogMapping(blog);
  }

  private async _getBlogs(
    filter: Record<string, unknown>,
    pagination: BlogQueryPagination,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const blogs = await this.blogModel
      .find({ ...filter, 'banInfo.isBanned': false })
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
