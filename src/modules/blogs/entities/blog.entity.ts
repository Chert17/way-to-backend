import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { BanUsersForBlog } from './ban.users.for.blog.entity';

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, collation: 'C' })
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

  @ManyToOne(() => User, user => user.blogs, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Post, posts => posts.blog)
  posts: Post[];

  @OneToMany(() => BanUsersForBlog, user => user.blog)
  bannedUsers: BanUsersForBlog[];
}
