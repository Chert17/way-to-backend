import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

const errorsFormat = (err: ValidationError[]) => {
  const errors = [];

  err.forEach(i =>
    errors.push({
      message: Object.values(i.constraints)[0],
      field: i.property,
    }),
  );

  return errors;
};

export const GlobalValidationPipe = new ValidationPipe({
  transform: true,
  stopAtFirstError: true,
  whitelist: true,
  exceptionFactory: (err: ValidationError[]) => {
    throw new BadRequestException(errorsFormat(err));
  },
});
