import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_recovery_password' })
export class RecoveryPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true })
  recovery_code: string;

  @Column({ type: 'timestamp' })
  expr_date: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
