import { WithId } from 'mongodb';

import { IPostDb } from '../db/db.types';
import { converterPost } from '../helpers/converterToValidFormatData/converter.post';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { BlogQueryRepo } from '../repositories/blogs/blog.query.repo';
import { PostRepo } from '../repositories/posts/post.repo';

export class PostService {
  constructor(
    protected blogQueryRepo: BlogQueryRepo,
    protected postRepo: PostRepo
  ) {}

  async createPost({
    blogId,
    content,
    shortDescription,
    title,
  }: PostInputModel): Promise<PostViewModel | null> {
    const blog = await this.blogQueryRepo.getBlogById(blogId);

    if (!blog) return null; // not found blog

    const newPost: IPostDb = {
      blogId: blog.id,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const result = await this.postRepo.createPost(newPost);

    return result ? converterPost(result) : null;
  }

  async updatePost(
    id: string,
    body: PostInputModel
  ): Promise<WithId<IPostDb> | null> {
    const { blogId, content, shortDescription, title } = body;

    return await this.postRepo.updatePost({
      id,
      blogId,
      content,
      shortDescription,
      title,
    });
  }

  async deletePost(id: string): Promise<WithId<IPostDb> | null> {
    return await this.postRepo.deletePost(id);
  }
}
