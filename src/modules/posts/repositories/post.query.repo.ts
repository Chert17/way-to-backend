import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { LikeStatus } from '../../../utils/like.status';
import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { PostViewDto } from '../dto/post.view.dto';

const { POSTS_TABLE, POSTS_REACTION_TABLE } = PostSqlTables;
const { BLOGS_TABLE } = BlogSqlTables;
const { USERS_TABLE, USERS_BAN_INFO_TABLE } = UsersSqlTables;

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPostById(userId: string, postId: string): Promise<PostViewDto> {
    const result = await this.dataSource.query(
      `
  select 
  p.id, 
  p.title, 
  p.short_descr as "shortDescription", 
  p.content, 
  p.created_at as "createdAt", 
  p.blog_id as "blogId", 
  b.title as "blogName", 
  (
    select 
      json_build_object(
        'likesCount', 
        count(*) filter (
          where 
            pr.status = '${LikeStatus.Like}' 
            and not exists (
              select 
                1 
              from 
                ${USERS_BAN_INFO_TABLE} bi 
              where 
                pr.user_id = bi.user_id 
                and bi.is_banned = true
            )
        ), 
        'dislikesCount', 
        count(*) filter (
          where 
            pr.status = '${LikeStatus.Dislike}' 
            and not exists (
              select 
                1 
              from 
                ${USERS_BAN_INFO_TABLE} bi 
              where 
                pr.user_id = bi.user_id 
                and bi.is_banned = true
            )
        ), 
        'myStatus', 
        coalesce(
          (
            select 
              pr_inner.status 
            from 
              ${POSTS_REACTION_TABLE} pr_inner 
              left join ${USERS_BAN_INFO_TABLE} bi on pr_inner.user_id = bi.user_id 
            where 
              pr_inner.post_id = p.id 
              and pr_inner.user_id = $2
          ), 
          '${LikeStatus.None}'
        ), 
        'newestLikes', 
        coalesce(
          (
            select 
              json_agg(
                json_build_object(
                  'addedAt', pr.created_at, 'userId', 
                  pr.user_id, 'login', u.login
                )
              ) 
            from 
              (
                select 
                  pr_inner.created_at, 
                  pr_inner.user_id 
                from 
                  ${POSTS_REACTION_TABLE} pr_inner 
                  left join ${USERS_TABLE} u on pr_inner.user_id = u.id 
                  left join ${USERS_BAN_INFO_TABLE} bi on pr_inner.user_id = bi.user_id 
                where 
                  pr_inner.post_id = p.id 
                  and pr_inner.status = '${LikeStatus.Like}' 
                  and bi.is_banned is null 
                order by 
                  pr_inner.created_at desc 
                limit 3
              ) as pr 
              left join ${USERS_TABLE} u on pr.user_id = u.id
          ), 
          '[]' :: json
        )
      ) 
    from 
      ${POSTS_REACTION_TABLE} pr 
    where 
      pr.post_id = p.id
  ) as "extendedLikesInfo" 
from 
  ${POSTS_TABLE} p 
  left join ${BLOGS_TABLE} b on p.blog_id = b.id 
where 
  p.id = $1 
  and b.is_ban = false
    `,
      [postId, userId],
    );

    return result[0];
  }

  async getAllPosts(
    userId: string,
    pagination: PostQueryPagination,
  ): Promise<WithPagination<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.dataSource.query(
      `
     select 
  p.id, 
  p.title, 
  p.short_descr as "shortDescription", 
  p.content, 
  p.created_at as "createdAt", 
  p.blog_id as "blogId", 
  b.title as "blogName", 
  (
    select 
      json_build_object(
        'likesCount', 
        count(*) filter (
          where 
            pr.status = '${LikeStatus.Like}' 
            and not exists (
              select 
                1 
              from 
                ${USERS_BAN_INFO_TABLE} bi 
              where 
                pr.user_id = bi.user_id 
                and bi.is_banned = true
            )
        ), 
        'dislikesCount', 
        count(*) filter (
          where 
            pr.status = '${LikeStatus.Dislike}' 
            and not exists (
              select 
                1 
              from 
                ${USERS_BAN_INFO_TABLE} bi 
              where 
                pr.user_id = bi.user_id 
                and bi.is_banned = true
            )
        ), 
        'myStatus', 
        coalesce(
          (
            select 
              pr_inner.status 
            from 
              ${POSTS_REACTION_TABLE} pr_inner 
              left join ${USERS_BAN_INFO_TABLE} bi on pr_inner.user_id = bi.user_id 
            where 
              pr_inner.post_id = p.id 
              and pr_inner.user_id = $1
          ), 
          '${LikeStatus.None}'
        ), 
        'newestLikes', 
        coalesce(
          (
            select 
              json_agg(
                json_build_object(
                  'addedAt', pr.created_at, 'userId', 
                  pr.user_id, 'login', u.login
                )
              ) 
            from 
              (
                select 
                  pr_inner.created_at, 
                  pr_inner.user_id 
                from 
                  ${POSTS_REACTION_TABLE} pr_inner 
                  left join ${USERS_TABLE} u on pr_inner.user_id = u.id 
                  left join ${USERS_BAN_INFO_TABLE} bi on pr_inner.user_id = bi.user_id 
                where 
                  pr_inner.post_id = p.id 
                  and pr_inner.status = '${LikeStatus.Like}' 
                  and bi.is_banned is null 
                order by 
                  pr_inner.created_at desc 
                limit 3
              ) as pr 
              left join ${USERS_TABLE} u on pr.user_id = u.id
          ), 
          '[]' :: json
        )
      ) 
    from 
      ${POSTS_REACTION_TABLE} pr 
    where 
      pr.post_id = p.id
  ) as "extendedLikesInfo" 
from 
  ${POSTS_TABLE} p 
  left join ${BLOGS_TABLE} b on p.blog_id = b.id 
    where b.is_ban = false
    order by p.${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [userId],
    );

    const totalCount = await this.dataSource.query(`
    select count(*) from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where b.is_ban = false

    `);

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
