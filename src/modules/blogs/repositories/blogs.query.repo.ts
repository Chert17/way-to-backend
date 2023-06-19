import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogQueryPagination } from '../../../utils/pagination/pagination';
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

  async getAllBlogsByUserId(userId: string, pagination: BlogQueryPagination) {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      pagination;

    const blogs = await this.dataSource.query(
      `
    select id, title as "name", descr as "description", web_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
    from ${BLOGS_TABLE}
    where user_id = $1 and title ilike $2
    order by ${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [userId, `%${searchNameTerm}%`],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${BLOGS_TABLE}
    where user_id = $1 and title ilike $2
    `,
      [userId, `%${searchNameTerm}%`],
    );

    const pageCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: blogs,
    };
  }
}
