import { WithId } from 'mongodb';

import { IPostDb } from '../db/db.types';
import { converterPost } from '../helpers/converterToValidFormatData/converter.post';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { blogQueryRepo } from '../repositories/blogs/blog.query.repo';
import { postRepo } from '../repositories/posts/post.repo';

export const postService = {
  createPost: async ({
    blogId,
    content,
    shortDescription,
    title,
  }: PostInputModel): Promise<PostViewModel | null> => {
    const blog = await blogQueryRepo.getBlogById(blogId);

    if (!blog) return null; // not found blog

    const newPost: IPostDb = {
      blogId: blog.id,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const result = await postRepo.createPost(newPost);

    return result ? converterPost(result) : null;
  },

  updatePost: async (
    id: string,
    body: PostInputModel
  ): Promise<WithId<IPostDb> | null> => {
    const { blogId, content, shortDescription, title } = body;

    return await postRepo.updatePost({
      id,
      blogId,
      content,
      shortDescription,
      title,
    });
  },

  deletePost: async (id: string): Promise<WithId<IPostDb> | null> => {
    return await postRepo.deletePost(id);
  },
};
