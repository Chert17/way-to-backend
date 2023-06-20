import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Blog } from '../../blogs/entities/blog.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, collation: 'C' })
  title: string;

  @Column({ type: 'text' })
  short_descr: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @ManyToOne(() => Blog, blog => blog.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
