import { WithId } from 'mongodb';

import { IPostDb } from '../../db/db.types';
import { PostViewModel } from '../../models/posts.models';

export const converterPost = (post: WithId<IPostDb>): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});
