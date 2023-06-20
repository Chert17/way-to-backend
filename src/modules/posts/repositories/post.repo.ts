import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { createPostDbDto } from '../../blogs/dto/create.post.by.blog.dto';

const { POSTS_TABLE } = PostSqlTables;

@Injectable()
export class PostsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPost(dto: createPostDbDto): Promise<{ postId: string }> {
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
}
