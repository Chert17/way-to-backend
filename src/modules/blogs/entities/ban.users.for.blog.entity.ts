import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Blog } from './blog.entity';

@Entity({ name: 'banned_blog_users' })
export class BanUsersForBlog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  ban_reason: string;

  @Column({ type: 'varchar', nullable: true })
  ban_date: string | null;

  @ManyToOne(() => User, user => user.bannedUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ban_user_id' })
  user: User;

  @ManyToOne(() => Blog, blog => blog.bannedUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
