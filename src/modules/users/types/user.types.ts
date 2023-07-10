import { ConfirmTelegram } from '../entities/confirm.telegram';

export enum CreateUserFormat {
  SA = 'sa',
  REGISTER = 'register',
}

export interface UserTelegramInfo extends ConfirmTelegram {
  user_id: string;
}
