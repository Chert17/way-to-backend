import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_ban_info' })
export class BanUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  is_banned: boolean;

  @Column({ type: 'varchar', length: 20 })
  ban_reason: string;

  @Column({ type: 'timestamp' })
  ban_date: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
