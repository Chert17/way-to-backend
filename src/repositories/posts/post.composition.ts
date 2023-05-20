import { PostController } from '../../controllers/post.controllers';
import { CommentService } from '../../service/comment.service';
import { PostService } from '../../service/post.service';
import { BlogQueryRepo } from '../blogs/blog.query.repo';
import { CommentQueryRepo } from '../comments/comment.query.repo';
import { CommentRepo } from '../comments/comment.repo';
import { UserQueryRepo } from '../users/user.query.repo';
import { PostQueryRepo } from './post.query.repo';
import { PostRepo } from './post.repo';

const postQueryRepo = new PostQueryRepo();
const postRepo = new PostRepo();
const blogQueryRepo = new BlogQueryRepo();
const userQueryRepo = new UserQueryRepo();

const postService = new PostService(blogQueryRepo, postRepo, userQueryRepo);

const commentQueryRepo = new CommentQueryRepo();
const commentRepo = new CommentRepo();
const commentService = new CommentService(
  userQueryRepo,
  commentRepo,
  commentQueryRepo
);

export const postController = new PostController(
  postQueryRepo,
  postService,
  commentQueryRepo,
  commentService
);
