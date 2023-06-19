import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { CreateBlogDbDto } from '../dto/create.blog.dto';

const { BLOGS_TABLE } = BlogSqlTables;

@Injectable()
export class BlogsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(dto: CreateBlogDbDto): Promise<{ blogId: string }> {
    const { userId, name, description, websiteUrl, createdAt } = dto;

    const result = await this.dataSource.query(
      `
      insert into ${BLOGS_TABLE} ("user_id", "title", "descr", "web_url", "created_at")
      values ($1, $2, $3, $4, $5)
      returning id
        `,
      [userId, name, description, websiteUrl, createdAt],
    );

    return { blogId: result[0].id };
  }
}
