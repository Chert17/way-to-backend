import { registerDecorator } from 'class-validator';

import { LikeStatus } from '../../../utils/like.status';

export const LikeStatusValue =
  (): PropertyDecorator =>
  (target: Record<string, unknown>, propertyKey: string) => {
    registerDecorator({
      name: 'likeStatus',
      target: target.constructor,
      propertyName: propertyKey,
      validator: {
        validate(value: string) {
          const status = Object.values(LikeStatus);

          const result = status.some(i => i === value);

          if (!result) return false;

          return true;
        },
        defaultMessage() {
          return `Incorrect likeStatus`;
        },
      },
    });
  };
