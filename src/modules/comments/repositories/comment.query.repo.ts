import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { LikeStatus } from '../../../utils/like.status';
import { CommentsSqlTables } from '../../../utils/tables/comments.sql.tables';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { CommentViewDto } from '../dto/comment.view.dto';

const { COMMENTS_TABLE } = CommentsSqlTables;
const { USERS_TABLE } = UsersSqlTables;

@Injectable()
export class CommentsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getCommentById(commentId: string): Promise<CommentViewDto> {
    const result = await this.dataSource.query(
      `
   select c.id, c.content, c.created_at as "createdAt",
   json_build_object('userId', c.user_id, 'userLogin', u.login) as "commentatorInfo",
   json_build_object('likesCount', 0, 'dislikesCount', 0, 'myStatus', '${LikeStatus.None}') as "likesInfo"
   from ${COMMENTS_TABLE} c
   left join ${USERS_TABLE} u on c.user_id = u.id
   where c.id = $1
      `,
      [commentId],
    );

    return result[0];
  }
}
