import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { BlogQueryPagination } from '../../../utils/pagination/pagination';
import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import {
  BanUserByBlogViewDto,
  BlogViewBySADto,
  BlogViewDto,
} from '../dto/blog.view.dto';

const { BLOGS_TABLE, BANNED_BLOG_USERS } = BlogSqlTables;
const { USERS_TABLE } = UsersSqlTables;

@Injectable()
export class BlogsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBlogById(blogId: string): Promise<BlogViewDto> {
    const result = await this.dataSource.query(
      `
    select id, title as "name", descr as "description", web_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
    from ${BLOGS_TABLE}
    where id = $1 and is_ban = false
    `,
      [blogId],
    );

    return result[0];
  }

  async getAllBlogsByUserId(
    userId: string,
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewDto>> {
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

  async getAllBanUsersByBloggerBlog(
    blogId: string,
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BanUserByBlogViewDto>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      pagination;

    const result = await this.dataSource.query(
      `
    select b_u.ban_user_id as "id", u.login,
    json_build_object(
    'banDate', b_u.ban_date,
    'banReason', b_u.ban_reason,
    'isBanned', case when b_u.ban_user_id is not null then true end
    ) as "banInfo"
    from ${BANNED_BLOG_USERS} b_u
    left join ${USERS_TABLE} u on b_u.ban_user_id = u.id
    where b_u.blog_id = $1 and u.login ilike $2
    order by u.${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [blogId, `%${searchNameTerm}%`],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${BANNED_BLOG_USERS} b_u
    left join ${USERS_TABLE} u on b_u.ban_user_id = u.id
    where b_u.blog_id = $1 and u.login ilike $2
    `,
      [blogId, `%${searchNameTerm}%`],
    );

    const pageCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: result,
    };
  }

  async getAllBlogsBySA(
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewBySADto>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      pagination;

    const result = await this.dataSource.query(
      `
    select b.id, b.title as "name", b.descr as "description", b.web_url as "websiteUrl", b.created_at as "createdAt", b.is_membership as "isMembership",
    json_build_object(
    'isBanned', coalesce(b.is_ban, false),
    'banDate', b.ban_date
     ) as "banInfo",
    json_build_object(
    'userId', u.id,
    'userLogin', u.login
    ) as "blogOwnerInfo"
    from ${BLOGS_TABLE} b
    left join ${USERS_TABLE} u on b.user_id = u.id
    where b.title ilike $1
    order by b.${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}

    `,
      [`%${searchNameTerm}%`],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${BLOGS_TABLE} b
    where b.title ilike $1
    `,
      [`%${searchNameTerm}%`],
    );

    const pageCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: result,
    };
  }
}
