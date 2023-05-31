import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class NoExistUser implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    const user = await this.usersRepo.checkUserByLoginOrEmail(value);

    if (!user) return false;

    return true;
  }

  defaultMessage() {
    return 'Incorrect value';
  }
}
