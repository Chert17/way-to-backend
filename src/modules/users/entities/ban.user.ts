import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'ban_users' })
export class BanUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_banned: boolean;

  @Column({ type: 'varchar' })
  ban_reason: string;

  @Column({ type: 'date' })
  expr_date: Date;

  @OneToOne(() => User, user => user.banUser)
  user: User;
}
