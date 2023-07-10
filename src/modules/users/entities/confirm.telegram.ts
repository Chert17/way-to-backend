import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_telegram_confirm' })
export class ConfirmTelegram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true })
  confirm_code: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
