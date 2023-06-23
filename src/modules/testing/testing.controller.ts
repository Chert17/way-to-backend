import { DataSource } from 'typeorm';

import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogSqlTables } from '../../utils/tables/blogs.sql.tables';
import { CommentsSqlTables } from '../../utils/tables/comments.sql.tables';
import { PostSqlTables } from '../../utils/tables/posts.sql.tables';
import { UsersSqlTables } from '../../utils/tables/users.sql.tables';

const { USERS_TABLE } = UsersSqlTables;
const { BLOGS_TABLE } = BlogSqlTables;
const { POSTS_TABLE } = PostSqlTables;
const { COMMENTS_TABLE } = CommentsSqlTables;

@Controller('testing/all-data')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete() {
    return this.dataSource.query(
      `TRUNCATE ${USERS_TABLE}, ${BLOGS_TABLE}, ${POSTS_TABLE}, ${COMMENTS_TABLE} CASCADE`,
    );
  }
}
