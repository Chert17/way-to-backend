import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { LikeStatus } from '../../../utils/like.status';
import { CommentQueryPagination } from '../../../utils/pagination/pagination';
import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { CommentsSqlTables } from '../../../utils/tables/comments.sql.tables';
import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { CommentViewDto } from '../dto/comment.view.dto';

const { COMMENTS_TABLE, COMMENTS_REACTIONS } = CommentsSqlTables;
const { USERS_TABLE, USERS_BAN_INFO_TABLE } = UsersSqlTables;
const { BLOGS_TABLE } = BlogSqlTables;
const { POSTS_TABLE } = PostSqlTables;

@Injectable()
export class CommentsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getCommentById(
    commentId: string,
    userId: string,
  ): Promise<CommentViewDto> {
    const result = await this.dataSource.query(
      `
   SELECT c.id,
		 c.content,
		 c.created_at AS "createdAt",
		 json_build_object('userId', c.user_id, 'userLogin', u.login) AS "commentatorInfo", 
	(SELECT json_build_object( 'likesCount', count(*) filter (where cr.status = '${LikeStatus.Like}'
			AND NOT EXISTS 
		(SELECT 1
		FROM ${USERS_BAN_INFO_TABLE} bi
		WHERE cr.user_id = bi.user_id
				AND bi.is_banned = true)), 'dislikesCount', count(*) filter (where cr.status = '${LikeStatus.Dislike}'
				AND NOT EXISTS 
			(SELECT 1
			FROM ${USERS_BAN_INFO_TABLE} bi
			WHERE cr.user_id = bi.user_id
					AND bi.is_banned = true)), 'myStatus', coalesce( 
				(SELECT cr.status
				FROM ${COMMENTS_REACTIONS} cr
				LEFT JOIN ${USERS_BAN_INFO_TABLE} bi
					ON cr.user_id = bi.user_id
				WHERE cr.comment_id = c.id
						AND cr.user_id = $2) , '${LikeStatus.None}') )
				FROM ${COMMENTS_REACTIONS} cr
				WHERE cr.comment_id = c.id ) AS "likesInfo"
			FROM ${COMMENTS_TABLE} c
		LEFT JOIN ${USERS_TABLE} u
		ON c.user_id = u.id
LEFT JOIN ${POSTS_TABLE} p
	ON c.post_id = p.id
LEFT JOIN ${BLOGS_TABLE} b
	ON p.blog_id = b.id
WHERE c.id = $1
		AND b.is_ban = false
      `,
      [commentId, userId],
    );

    return result[0];
  }

  async getAllCommentsByPost(
    userId: string,
    postId: string,
    pagination: CommentQueryPagination,
  ): Promise<WithPagination<CommentViewDto>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = pagination;

    const result = await this.dataSource.query(
      `
		SELECT c.id,
		 c.content,
		 c.created_at AS "createdAt",
		 json_build_object('userId', c.user_id, 'userLogin', u.login) AS "commentatorInfo", 
	(SELECT json_build_object( 'likesCount', count(*) filter (where cr.status = '${
    LikeStatus.Like
  }'
			AND NOT EXISTS 
		(SELECT 1
		FROM ${USERS_BAN_INFO_TABLE} bi
		WHERE cr.user_id = bi.user_id
				AND bi.is_banned = true)), 'dislikesCount', count(*) filter (where cr.status = '${
          LikeStatus.Dislike
        }'
				AND NOT EXISTS 
			(SELECT 1
			FROM ${USERS_BAN_INFO_TABLE} bi
			WHERE cr.user_id = bi.user_id
					AND bi.is_banned = true)), 'myStatus', coalesce( 
				(SELECT cr.status
				FROM ${COMMENTS_REACTIONS} cr
				LEFT JOIN ${USERS_BAN_INFO_TABLE} bi
					ON cr.user_id = bi.user_id
				WHERE cr.comment_id = c.id
						AND cr.user_id = $2) , '${LikeStatus.None}') )
				FROM ${COMMENTS_REACTIONS} cr
				WHERE cr.comment_id = c.id ) AS "likesInfo"
			FROM ${COMMENTS_TABLE} c
		LEFT JOIN ${USERS_TABLE} u
		ON c.user_id = u.id
LEFT JOIN ${POSTS_TABLE} p
	ON c.post_id = p.id
LEFT JOIN ${BLOGS_TABLE} b
	ON p.blog_id = b.id
WHERE p.id = $1
		AND b.is_ban = false
ORDER BY  c.${sortBy} ${sortDirection} LIMIT ${pageSize} OFFSET ${pagination.skip()}
	 `,
      [postId, userId],
    );

    const totalCount = await this.dataSource.query(
      `
	 SELECT count(*)
FROM ${COMMENTS_TABLE} c
LEFT JOIN ${POSTS_TABLE} p
	ON c.post_id = p.id
LEFT JOIN ${BLOGS_TABLE} b
	ON p.blog_id = b.id
WHERE p.id = $1
		AND b.is_ban = false
	  `,
      [postId],
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
