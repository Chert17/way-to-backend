import { PostController } from '../../controllers/post.controllers';
import { PostService } from '../../service/post.service';
import { blogQueryRepo } from '../blogs/blog.composition';
import { PostQueryRepo } from './post.query.repo';
import { PostRepo } from './post.repo';

export const postQueryRepo = new PostQueryRepo();
const postRepo = new PostRepo();
export const postService = new PostService(blogQueryRepo, postRepo);

export const postController = new PostController(postQueryRepo, postService);
