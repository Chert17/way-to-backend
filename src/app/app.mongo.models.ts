import { Blog, BlogSchema } from '../modules/blogs/blogs.schema';
import { Comment, CommentSchema } from '../modules/comments/comments.schema';
import { Devices, DevicesSchema } from '../modules/devices/devices.schema';
import { Post, PostSchema } from '../modules/posts/posts.schema';
import { User, UserSchema } from '../modules/users/schemas/users.schema';

export const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: User.name, schema: UserSchema },
  { name: Devices.name, schema: DevicesSchema },
];
