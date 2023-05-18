import { CommentController } from '../../controllers/comment.controllers';
import { CommentService } from '../../service/comment.service';
import { UserQueryRepo } from '../users/user.query.repo';
import { CommentQueryRepo } from './comment.query.repo';
import { CommentRepo } from './comment.repo';

const userQueryRepo = new UserQueryRepo();

const commentQueryRepo = new CommentQueryRepo();
const commentRepo = new CommentRepo();
const commentService = new CommentService(
  userQueryRepo,
  commentRepo,
  commentQueryRepo
);

export const commentController = new CommentController(
  commentQueryRepo,
  commentService
);
