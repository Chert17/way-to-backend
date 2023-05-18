import { BlogController } from '../../controllers/blog.controllers';
import { BlogService } from '../../service/blog.service';
import { PostService } from '../../service/post.service';
import { PostQueryRepo } from '../posts/post.query.repo';
import { PostRepo } from '../posts/post.repo';
import { BlogQueryRepo } from './blog.query.repo';
import { BlogRepo } from './blog.repo';

const blogQueryRepo = new BlogQueryRepo();
const blogRepo = new BlogRepo();
const blogService = new BlogService(blogRepo);

const postQueryRepo = new PostQueryRepo();
const postRepo = new PostRepo();
const postService = new PostService(blogQueryRepo, postRepo);

export const blogController = new BlogController(
  blogQueryRepo,
  blogService,
  postQueryRepo,
  postService
);
