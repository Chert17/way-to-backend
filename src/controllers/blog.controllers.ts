import { Response } from 'express';

import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import {
  BlogInputModel,
  BlogPostInputModel,
  BlogViewModel,
} from '../models/blogs.models';
import { PostViewModel } from '../models/posts.models';
import { blogQueryRepo } from '../repositories/blogs/blog.query.repo';
import { postQueryRepo } from '../repositories/posts/post.query.repo';
import { blogService } from '../service/blog.service';
import { postService } from '../service/post.service';
import { IWithPagination } from '../types/pagination.interface';
import {
  PaginationQueryParams,
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
  TypeRequestParamsAndQuery,
  TypeRequestQuery,
} from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const getAllBlogsController = async (
  req: TypeRequestQuery<PaginationQueryParams & { searchNameTerm: string }>,
  res: Response<IWithPagination<BlogViewModel>>
) => {
  const { searchNameTerm } = req.query;

  const pagination = paginationQueryParamsValidation(req.query);

  const name = !searchNameTerm ? null : searchNameTerm;

  const blogs = await blogQueryRepo.getAllBlogs(name, pagination);

  return res.status(STATUS_CODE.OK).json(blogs);
};

export const getBlogByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<BlogViewModel>
) => {
  const blog = await blogQueryRepo.getBlogById(req.params.id);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found blog

  return res.status(STATUS_CODE.OK).json(blog);
};

export const createBlogController = async (
  req: TypeRequestBody<BlogInputModel>,
  res: Response<BlogViewModel>
) => {
  const { name, description, websiteUrl } = req.body;

  const blog = await blogService.createBlog(name, description, websiteUrl);

  if (!blog) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // failed create blog

  return res.status(STATUS_CODE.CREATED).json(blog);
};

export const updateBlogController = async (
  req: TypeRequestParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response
) => {
  const blogId = await blogQueryRepo.getBlogById(req.params.id);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found blog

  const result = await blogService.updateBlog(req.params.id, req.body);

  if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild update blog

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const deleteBlogController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const blogId = await blogQueryRepo.getBlogById(req.params.id);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found blog

  const result = await blogService.deleteBlog(req.params.id);

  if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild delete blog

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const getAllPostsByOneBlogController = async (
  req: TypeRequestParamsAndQuery<{ blogId: string }, PaginationQueryParams>,
  res: Response<IWithPagination<PostViewModel>>
) => {
  const pagination = paginationQueryParamsValidation(req.query);

  const blogId = await blogQueryRepo.getBlogById(req.params.blogId);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found blog by this blogId

  const posts = await postQueryRepo.getAllPostsByOneBlog(blogId.id, pagination);

  return res.status(STATUS_CODE.OK).json(posts);
};

export const createPostByBlogIdController = async (
  req: TypeRequestParamsAndBody<{ blogId: string }, BlogPostInputModel>,
  res: Response<PostViewModel>
) => {
  const { content, shortDescription, title } = req.body;

  const blogId = await blogQueryRepo.getBlogById(req.params.blogId);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND); // not found blog

  const post = await postService.createPost({
    blogId: blogId.id,
    content,
    shortDescription,
    title,
  });

  if (!post) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild creat post

  return res.status(STATUS_CODE.CREATED).json(post);
};
