import { BlogSubscription } from '../../users/entities/blog.subscribes';
import { Blog } from '../entities/blog.entity';

export interface BlogDb extends Blog {
  user_id: string;
}

export interface BlogWallpaper {
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export enum BlogSub {
  Subscribed = 'Subscribed',
  Unsubscribed = 'Unsubscribed',
  None = 'None',
}

export interface BlogSubDb extends BlogSubscription {
  user_id: string;
  blog_id: string;
}
