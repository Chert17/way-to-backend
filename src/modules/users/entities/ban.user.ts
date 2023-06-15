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

  @Column({ type: 'varchar', nullable: true })
  ban_reason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  ban_date: string | null;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}