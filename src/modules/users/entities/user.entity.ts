import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BanUsersForBlog } from '../../blogs/entities/ban.users.for.blog.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { CommentsReactions } from '../../comments/entities/comment.reaction.entity';
import { PostsReactions } from '../../posts/entities/post.reaction.entity';
import { CreateUserFormat } from '../types/user.types';
import { BlogSubscription } from './blog.subscribes';
import { Device } from './devices';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 10, collation: 'C' })
  login: string;

  @Column({ type: 'varchar', unique: true, length: 100, collation: 'C' })
  email: string;

  @Column({ type: 'text', unique: true })
  pass_hash: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'enum', enum: CreateUserFormat })
  format: CreateUserFormat;

  @Column({ type: 'bigint', nullable: true, default: null })
  telegram_id: number;

  @Column({ type: 'bigint', nullable: true, default: null })
  chat_id: number;

  @OneToMany(() => Device, devices => devices.user)
  devices: Device[];

  @OneToMany(() => Blog, blogs => blogs.user)
  blogs: Blog[];

  @OneToMany(() => BanUsersForBlog, banUser => banUser.user)
  bannedUsers: BanUsersForBlog[];

  @OneToMany(() => Comment, comments => comments.user)
  comments: Comment[];

  @OneToMany(() => PostsReactions, reactions => reactions.user)
  posts_reactions: PostsReactions[];

  @OneToMany(() => CommentsReactions, reactions => reactions.user)
  comments_reactions: CommentsReactions[];

  @OneToMany(() => BlogSubscription, subscription => subscription.user)
  blog_subscriptions: BlogSubscription[];
}
