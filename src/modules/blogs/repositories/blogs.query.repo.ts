import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { BlogViewDto } from '../dto/blog.view.dto';

const { BLOGS_TABLE } = BlogSqlTables;

@Injectable()
export class BlogsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBlogById(blogId: string): Promise<BlogViewDto> {
    const result = await this.dataSource.query(
      `
    select id, title as "name", descr as "description", web_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
    from ${BLOGS_TABLE}
    where id = $1
    `,
      [blogId],
    );

    return result[0];
  }
}
