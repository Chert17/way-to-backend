import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class ExistUserByLoginOrEmail implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    const alreadyUser =
      await this.usersRepo.checkUserWithEmailInfoAndBanInfoByLoginOrEmail(
        value,
      );

    if (alreadyUser) return false;

    return true;
  }

  defaultMessage() {
    return 'Incorrect login or email';
  }
}
