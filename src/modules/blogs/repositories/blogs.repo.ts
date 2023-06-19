import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { CreateBlogDbDto } from '../dto/create.blog.dto';
import { UpdateBlogDbDto } from '../dto/update.blog.dto';
import { BlogDb } from '../types/blog.types';

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

  async updateBlog(dto: UpdateBlogDbDto) {
    const { blogId, name, description, websiteUrl } = dto;

    return this.dataSource.query(
      `
    update ${BLOGS_TABLE}
    set title = $2, descr = $3, web_url = $4
    where id = $1
    `,
      [blogId, name, description, websiteUrl],
    );
  }

  async checkBlogById(blogId: string): Promise<BlogDb> {
    const result = await this.dataSource.query(
      `
    select * from ${BLOGS_TABLE} where id = $1
    `,
      [blogId],
    );

    return result[0];
  }
}
