import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_confirm_email' })
export class ConfirmEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true })
  confirm_code: string;

  @Column({ type: 'timestamp' })
  expr_date: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
