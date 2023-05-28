import { registerDecorator, ValidationArguments } from 'class-validator';

export const Trim =
  (): PropertyDecorator =>
  (target: Record<string, unknown>, propertyKey: string) => {
    registerDecorator({
      name: 'trim',
      target: target.constructor,
      propertyName: propertyKey,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const trimmedValue = value.trim();

          if (trimmedValue.length < 1) return false;
          // Если значение после трима отличается от исходного значения,
          // присваиваем триммированное значение обратно свойству объекта
          if (trimmedValue !== value) {
            args.object[propertyKey] = trimmedValue;
          }
          return true;
        },
        defaultMessage() {
          return `This fiaeld must be a string and not empty`;
        },
      },
    });
  };
