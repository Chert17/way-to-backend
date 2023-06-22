import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { CommentsSqlTables } from '../../../utils/tables/comments.sql.tables';
import { CreateCommentDbDto } from '../../posts/dto/create.comment.dto';

const { COMMENTS_TABLE } = CommentsSqlTables;

@Injectable()
export class CommentsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(dto: CreateCommentDbDto): Promise<{ commentId: string }> {
    const { userId, postId, content, createdAt } = dto;

    const result = await this.dataSource.query(
      `
     insert into ${COMMENTS_TABLE} ("user_id", "post_id", "content", "created_at")
     values ($1, $2, $3, $4)
     returning id
     `,
      [userId, postId, content, createdAt],
    );

    return { commentId: result[0].id };
  }
}
