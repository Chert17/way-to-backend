import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { LikeStatus } from '../../../utils/like.status';
import {
  BlogQueryPagination,
  CommentQueryPagination,
  PostQueryPagination,
} from '../../../utils/pagination/pagination';
import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { CommentsSqlTables } from '../../../utils/tables/comments.sql.tables';
import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { PostViewDto } from '../../posts/dto/post.view.dto';
import { AllCommentsByBloggerBlogViewDto } from '../dto/all.comments.by.blogger.blog.view.dto';
import {
  BanUserByBlogViewDto,
  BlogViewBySADto,
  BlogViewDto,
} from '../dto/blog.view.dto';

const { BLOGS_TABLE, BANNED_BLOG_USERS } = BlogSqlTables;
const { USERS_TABLE, USERS_BAN_INFO_TABLE } = UsersSqlTables;
const { POSTS_TABLE } = PostSqlTables;
const { COMMENTS_TABLE, COMMENTS_REACTIONS } = CommentsSqlTables;

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
    order by b.${sortBy === 'name' ? '"title"' : sortBy} ${sortDirection}
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

  async getAllBlogs(
    pagination: BlogQueryPagination,
  ): Promise<WithPagination<BlogViewDto>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      pagination;

    const result = await this.dataSource.query(
      `
    select id, title as "name", descr as "description", web_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
    from ${BLOGS_TABLE}
    where title ilike $1 and is_ban = false
    order by ${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [`%${searchNameTerm}%`],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${BLOGS_TABLE}
    where title ilike $1 and is_ban = false
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

  async getAllPostsByBlog(
    userId: string,
    blogId: string,
    pagination: PostQueryPagination,
  ): Promise<WithPagination<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.dataSource.query(
      `
    select p.id, p.title, p.short_descr as "shortDescription", p.content, p.created_at as "createdAt", p.blog_id as "blogId", b.title as "blogName"
    from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where p.blog_id = $1 and b.is_ban = false
    order by p.${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [blogId],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where p.blog_id = $1 and b.is_ban = false
    `,
      [blogId],
    );

    const pageCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: result.map((i: any) => ({
        ...i,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async getAllCommentsByBloggerBlog(
    userId: string,
    pagination: CommentQueryPagination,
  ): Promise<WithPagination<AllCommentsByBloggerBlogViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.dataSource.query(
      `
    SELECT
    c.id,
    c.content,
    c.created_at AS "createdAt",
    json_build_object('userId', c.user_id, 'userLogin', u.login) AS "commentatorInfo",
    (
        SELECT
            json_build_object(
                'likesCount',
                count(*) FILTER (WHERE cr.status = '${
                  LikeStatus.Like
                }' AND NOT EXISTS (SELECT 1 FROM ${USERS_BAN_INFO_TABLE} bi WHERE cr.user_id = bi.user_id AND bi.is_banned = true)),
                'dislikesCount',
                count(*) FILTER (WHERE cr.status = '${
                  LikeStatus.Dislike
                }' AND NOT EXISTS (SELECT 1 FROM ${USERS_BAN_INFO_TABLE} bi WHERE cr.user_id = bi.user_id AND bi.is_banned = true)),
                'myStatus',
                coalesce(
                    (
                        SELECT cr_inner.status
                        FROM ${COMMENTS_REACTIONS} cr_inner
                        LEFT JOIN ${USERS_BAN_INFO_TABLE} bi ON cr_inner.user_id = bi.user_id
                        WHERE cr_inner.comment_id = c.id
                        AND cr_inner.user_id = $1
                    ),
                    '${LikeStatus.None}'
                )
            )
        FROM ${COMMENTS_REACTIONS} cr
        WHERE cr.comment_id = c.id
    ) AS "likesInfo",
    json_build_object('id', p.id, 'title', p.title, 'blogId', p.blog_id, 'blogName', b.title) AS "postInfo"
FROM ${BLOGS_TABLE} b
LEFT JOIN ${POSTS_TABLE} p ON b.id = p.blog_id
LEFT JOIN ${COMMENTS_TABLE} c ON p.id = c.post_id
LEFT JOIN ${USERS_TABLE} u ON b.user_id = u.id
WHERE b.user_id = $1
AND b.is_ban = false
GROUP BY c.id, p.id, b.title, u.login
ORDER BY c.${sortBy} ${sortDirection}
LIMIT ${pageSize} OFFSET ${pagination.skip()};
    `,
      [userId],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT count(*)
FROM ${COMMENTS_TABLE} c
LEFT JOIN ${POSTS_TABLE} p
	ON c.post_id = p.id
LEFT JOIN ${BLOGS_TABLE} b
	ON p.blog_id = b.id
LEFT JOIN ${USERS_TABLE} u
	ON b.user_id = u.id
WHERE b.user_id = $1
		AND b.is_ban = false
    `,
      [userId],
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
