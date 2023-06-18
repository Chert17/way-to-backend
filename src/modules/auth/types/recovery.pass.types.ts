import { RecoveryPassword } from '../../users/entities/recovery.pass';

export interface RecoveryPassDb extends RecoveryPassword {
  user_id: string;
}
