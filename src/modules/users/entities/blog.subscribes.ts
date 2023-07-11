import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Blog } from '../../blogs/entities/blog.entity';
import { BlogSub } from '../../blogs/types/blog.types';
import { User } from './user.entity';

@Entity({ name: 'users_blogs_subscriptions' })
export class BlogSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: BlogSub, default: BlogSub.None })
  user_sub_status: BlogSub;

  @ManyToOne(() => User, user => user.blog_subscriptions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, blog => blog.blog_subscriptions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
