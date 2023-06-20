import { Post } from '../entities/post.entity';

export interface PostDb extends Post {
  blog_id: string;
}
