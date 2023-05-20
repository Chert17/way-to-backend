import { BlogController } from '../../controllers/blog.controllers';
import { BlogService } from '../../service/blog.service';
import { PostService } from '../../service/post.service';
import { PostQueryRepo } from '../posts/post.query.repo';
import { PostRepo } from '../posts/post.repo';
import { UserQueryRepo } from '../users/user.query.repo';
import { BlogQueryRepo } from './blog.query.repo';
import { BlogRepo } from './blog.repo';

const blogQueryRepo = new BlogQueryRepo();
const blogRepo = new BlogRepo();
const blogService = new BlogService(blogRepo);

const postQueryRepo = new PostQueryRepo();
const postRepo = new PostRepo();
const userQueryRepo = new UserQueryRepo();
const postService = new PostService(blogQueryRepo, postRepo, userQueryRepo);

export const blogController = new BlogController(
  blogQueryRepo,
  blogService,
  postQueryRepo,
  postService
);
