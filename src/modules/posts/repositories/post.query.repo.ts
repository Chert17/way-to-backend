import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { PostQueryPagination } from '../../../utils/pagination/pagination';
import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { PostViewDto } from '../dto/post.view.dto';

const { POSTS_TABLE } = PostSqlTables;
const { BLOGS_TABLE } = BlogSqlTables;

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPostById(userId: string, postId: string): Promise<PostViewDto> {
    const result = await this.dataSource.query(
      `
    select p.id, p.title, p.short_descr as "shortDescription", p.content, p.created_at as "createdAt", p.blog_id as "blogId", b.title as "blogName"
    from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where p.id = $1 and b.is_ban = false
    `,
      [postId],
    );

    return (
      result[0] && {
        ...result[0],
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      }
    );
  }

  async getAllPosts(
    userId: string,
    pagination: PostQueryPagination,
  ): Promise<WithPagination<PostViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.dataSource.query(
      `
    select p.id, p.title, p.short_descr as "shortDescription", p.content, p.created_at as "createdAt", p.blog_id as "blogId", b.title as "blogName"
    from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where b.is_ban = false
    order by p.${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
    );

    const totalCount = await this.dataSource.query(`
    select count(*) from ${POSTS_TABLE}
    `);

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
}
