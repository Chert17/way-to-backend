import { BlogController } from '../../controllers/blog.controllers';
import { BlogService } from '../../service/blog.service';
import { postQueryRepo, postService } from '../posts/post.composition';
import { BlogQueryRepo } from './blog.query.repo';
import { BlogRepo } from './blog.repo';

export const blogQueryRepo = new BlogQueryRepo();
const blogRepo = new BlogRepo();
const blogService = new BlogService(blogRepo);

export const blogController = new BlogController(
  blogQueryRepo,
  blogService,
  postQueryRepo,
  postService
);
