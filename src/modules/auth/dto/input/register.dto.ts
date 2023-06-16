export class RegisterDbDto {
  readonly userId: string;
  readonly isConfirmed: boolean;
  readonly confirmCode: string;
  readonly exprDate: string;
}
