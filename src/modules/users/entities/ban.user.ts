import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_ban_info' })
export class BanUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_banned: boolean;

  @Column({ type: 'varchar', default: null, nullable: true })
  ban_reason: string;

  @Column({ type: 'date', default: null, nullable: true })
  ban_date: Date;

  @OneToOne(() => User, user => user.banUser)
  user: User;
}
