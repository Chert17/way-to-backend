import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LikeStatus } from '../../../utils/like.status';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'comments_reactions' })
export class CommentsReactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  status: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'varchar' })
  updated_at: string;

  @ManyToOne(() => Comment, comment => comment.comments_reactions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
