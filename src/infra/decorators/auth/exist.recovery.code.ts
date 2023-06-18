import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@ValidatorConstraint({ async: true })
export class ExistRecoveryCode implements ValidatorConstraintInterface {
  constructor(private usersRepo: UsersRepo) {}

  async validate(value: string) {
    const recoveryPassInfo = await this.usersRepo.getRecoveryPassInfoByCode(
      value,
    );

    if (!recoveryPassInfo) return false;

    const { expr_date } = recoveryPassInfo;

    if (expr_date < new Date().toISOString()) return false;

    return true;
  }

  defaultMessage() {
    return 'Incorrect code';
  }
}
