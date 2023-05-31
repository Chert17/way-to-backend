import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class ResendingEmailExist implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    const confirmEmail = await this.usersRepo.getConfirmEmailByEmail(value);

    if (!confirmEmail) return false;

    if (confirmEmail.isConfirmed === true) return false; // user has already been verified

    return true;
  }

  defaultMessage() {
    return 'Incorrect value';
  }
}
