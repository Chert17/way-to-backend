import { Blog } from '../entities/blog.entity';

export interface BlogDb extends Blog {
  user_id: string;
}
