import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { CommentsSqlTables } from '../../../utils/tables/comments.sql.tables';
import { CreateCommentDbDto } from '../../posts/dto/create.comment.dto';
import { CommentsLikeStatusDbDto } from '../dto/comment.like.status';
import { UpdateCommentDbDto } from '../dto/update.comment.dto';
import { CommentDb } from '../types/comment.types';

const { COMMENTS_TABLE, COMMENTS_REACTIONS } = CommentsSqlTables;

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

  async setLikeStatus(dto: CommentsLikeStatusDbDto) {
    const { userId, commentId, likeStatus, createdAt, updatedAt } = dto;

    return this.dataSource.query(`
      do $$
      begin
      if exists (select * from ${COMMENTS_REACTIONS} cr where cr.comment_id = '${commentId}' and cr.user_id = '${userId}')
      then
      update ${COMMENTS_REACTIONS} cr set status = '${likeStatus}', updated_at = '${updatedAt}'
      where cr.comment_id = '${commentId}' and cr.user_id = '${userId}';
      else
      insert into ${COMMENTS_REACTIONS} ("user_id", "comment_id", "status", "created_at", "updated_at")
      values ('${userId}', '${commentId}','${likeStatus}', '${createdAt}', '${updatedAt}');
      end if;
      end $$;`);
  }

  async updateComment(dto: UpdateCommentDbDto) {
    const { commentId, content } = dto;

    return this.dataSource.query(
      `
    update ${COMMENTS_TABLE}
    set content = $2
    where id = $1
    `,
      [commentId, content],
    );
  }

  async checkCommentById(commentId: string): Promise<CommentDb> {
    const result = await this.dataSource.query(
      `
    select * from ${COMMENTS_TABLE} where id = $1
    `,
      [commentId],
    );

    return result[0];
  }
}
