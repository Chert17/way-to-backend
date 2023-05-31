import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { NotFoundException } from '@nestjs/common';

import { BlogsRepo } from '../../../modules/blogs/repositories/blogs.repo';

@ValidatorConstraint({ async: true })
export class ExistBlog implements ValidatorConstraintInterface {
  constructor(private blogsRepo: BlogsRepo) {}

  async validate(value: string) {
    const blog = await this.blogsRepo.checkBlogById(value);

    if (!blog) throw new NotFoundException();

    return true;
  }

  defaultMessage() {
    return 'Blog no exist';
  }
}
