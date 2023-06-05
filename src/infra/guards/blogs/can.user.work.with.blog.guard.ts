import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BlogsRepo } from '../../../modules/blogs/repositories/blogs.repo';

@Injectable()
export class CanUserWorkWithBlog implements CanActivate {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const currentUserId = request.user._id.toString();

    const blogId = request.params.id;

    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (currentUserId !== blog.userId) throw new ForbiddenException();

    return true;
  }
}
