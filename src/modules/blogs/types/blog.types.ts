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
