import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class ResendingEmailExist implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    if (typeof value !== 'string') return false;

    const trimValue = value.trim();

    if (!trimValue.length) return false;

    const confirmEmail = await this.usersRepo.getConfirmEmailByEmail(trimValue);
    console.log('DECORATOR', confirmEmail);

    if (!confirmEmail) return false;

    if (confirmEmail.isConfirmed === true) return false; // user has already been verified

    return true;
  }

  defaultMessage() {
    return 'Incorrect value';
  }
}
