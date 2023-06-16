import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class ExistConfirmCode implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    const [emailInfo] = await this.usersRepo.getConfirmEmailImfoByCode(value);

    if (!emailInfo) return false;

    if (emailInfo.is_confirmed === true) return false; // user has already been verified

    if (emailInfo.expr_date < new Date().toISOString()) return false; // invalid expirationDate

    return true;
  }

  defaultMessage() {
    return 'Incorrect value';
  }
}
