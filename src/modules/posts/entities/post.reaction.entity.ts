import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LikeStatus } from '../../../utils/like.status';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Index(['post_id', 'user_id'], { unique: true })
@Entity({ name: 'posts_reactions' })
export class PostsReactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  status: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'varchar' })
  updated_at: string;

  @ManyToOne(() => Post, post => post.posts_reactions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'uuid' })
  post_id: string;

  @ManyToOne(() => User, user => user.posts_reactions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;
}
