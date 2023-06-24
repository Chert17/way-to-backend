import { Comment } from '../entities/comment.entity';

export type CommentDb = Comment & {
  user_id: string;
  post_id: string;
};
