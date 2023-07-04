import { BadRequestException } from '@nestjs/common';

export const customBadRequestException = (field: string, message: string) => {
  throw new BadRequestException([{ message, field }]);
};
