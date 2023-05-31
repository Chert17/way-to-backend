import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PostsRepo } from '../../../modules/posts/repositories/posts.repo';

@ValidatorConstraint({ async: true })
export class ExistPost implements ValidatorConstraintInterface {
  constructor(private postsRepo: PostsRepo) {}

  async validate(value: string) {
    const blog = await this.postsRepo.checkPostById(value);

    if (!blog) return false;

    return true;
  }

  defaultMessage() {
    return 'Post no exist';
  }
}
