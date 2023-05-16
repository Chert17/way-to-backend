import { CommentController } from '../../controllers/comment.controllers';
import { CommentService } from '../../service/comment.service';
import { userQueryRepo } from '../users/user.composition';
import { CommentQueryRepo } from './comment.query.repo';
import { CommentRepo } from './comment.repo';

export const commentQueryRepo = new CommentQueryRepo();
const commentRepo = new CommentRepo();
export const commentService = new CommentService(userQueryRepo, commentRepo);

export const commentController = new CommentController(
  commentQueryRepo,
  commentService
);
