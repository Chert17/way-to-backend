import { WithId } from 'mongodb';

import { IBlogDb } from '../../db/db.types';
import { BlogViewModel } from '../../models/blogs.models';

export const converterBlog = (blog: WithId<IBlogDb>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
});
