import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { CreatePostDbDto } from '../../blogs/dto/create.post.by.blog.dto';
import { UpdatePostDbDto } from '../../blogs/dto/update.post.by.blog';
import { PostDb } from '../types/post.types';

const { POSTS_TABLE } = PostSqlTables;

@Injectable()
export class PostsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPost(dto: CreatePostDbDto): Promise<{ postId: string }> {
    const { blogId, title, content, shortDescription, createdAt } = dto;

    const result = await this.dataSource.query(
      `
    insert into ${POSTS_TABLE} ("blog_id", "title", "short_descr", "content", "created_at")
    values ($1, $2, $3, $4, $5)
    returning id
    `,
      [blogId, title, shortDescription, content, createdAt],
    );

    return { postId: result[0].id };
  }

  async updatePost(dto: UpdatePostDbDto) {
    const { postId, title, shortDescription, content } = dto;

    return this.dataSource.query(
      `
    update ${POSTS_TABLE}
    set title = $2, short_descr = $3, content = $4
    where id = $1
    `,
      [postId, title, shortDescription, content],
    );
  }

  async deletePost(postId: string) {
    return this.dataSource.query(
      `
    delete from ${POSTS_TABLE} where id = $1
    `,
      [postId],
    );
  }

  async checkPostById(postId: string): Promise<PostDb> {
    const result = await this.dataSource.query(
      `
    select * from ${POSTS_TABLE} where id = $1
    `,
      [postId],
    );

    return result[0];
  }
}
