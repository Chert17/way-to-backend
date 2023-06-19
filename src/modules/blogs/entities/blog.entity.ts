import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column({ type: 'text' })
  descr: string;

  @Column({ type: 'varchar', unique: true })
  web_url: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'boolean', default: false })
  is_membership: boolean;

  @Column({ type: 'boolean', default: false })
  is_ban: boolean;

  @Column({ type: 'varchar', nullable: true })
  ban_date: string | null;

  @ManyToOne(() => User, user => user.blogs, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
