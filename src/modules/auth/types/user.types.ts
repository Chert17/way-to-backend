import { CreateUserFormat } from '../../users/types/user.types';

export interface UserWithEmailInfoAndBanInfo {
  id: string;
  login: string;
  email: string;
  created_at: string;
  format: CreateUserFormat;
  pass_hash: string;
  is_confirmed: null | true;
  is_banned: null | true;
}
