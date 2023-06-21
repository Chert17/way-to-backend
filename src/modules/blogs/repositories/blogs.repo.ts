import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { BlogSqlTables } from '../../../utils/tables/blogs.sql.tables';
import { PostSqlTables } from '../../../utils/tables/posts.sql.tables';
import { BanBlogDbDto } from '../dto/ban.blog.dto';
import { BanUserByBloggerBlogDbDto } from '../dto/ban.user.by.blogger.blog.dto';
import { CreateBlogDbDto } from '../dto/create.blog.dto';
import { UpdateBlogDbDto } from '../dto/update.blog.dto';
import { BlogDb } from '../types/blog.types';

const { BLOGS_TABLE, BANNED_BLOG_USERS } = BlogSqlTables;
const { POSTS_TABLE } = PostSqlTables;

@Injectable()
export class BlogsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(dto: CreateBlogDbDto): Promise<{ blogId: string }> {
    const { userId, name, description, websiteUrl, createdAt } = dto;

    const result = await this.dataSource.query(
      `
      insert into ${BLOGS_TABLE} ("user_id", "title", "descr", "web_url", "created_at")
      values ($1, $2, $3, $4, $5)
      returning id
        `,
      [userId, name, description, websiteUrl, createdAt],
    );

    return { blogId: result[0].id };
  }

  async updateBlog(dto: UpdateBlogDbDto) {
    const { blogId, name, description, websiteUrl } = dto;

    return this.dataSource.query(
      `
    update ${BLOGS_TABLE}
    set title = $2, descr = $3, web_url = $4
    where id = $1
    `,
      [blogId, name, description, websiteUrl],
    );
  }

  async deleteBlog(blogId: string) {
    return this.dataSource.query(
      `
    delete from ${BLOGS_TABLE} where id = $1
    `,
      [blogId],
    );
  }

  async banUserByBloggerBlog(dto: BanUserByBloggerBlogDbDto) {
    const { banUserId, blogId, isBanned, banReason, banDate } = dto;

    return this.dataSource.query(
      `
    DO $$
      BEGIN
        IF ${isBanned} THEN
          INSERT INTO ${BANNED_BLOG_USERS} (ban_user_id, blog_id, ban_reason, ban_date)
          VALUES ('${banUserId}', '${blogId}', '${banReason}', '${banDate}');
      ELSE
          DELETE FROM ${BANNED_BLOG_USERS} WHERE ban_user_id = '${banUserId}' and blog_id = '${blogId}';
      END IF;
    END $$;`,
    );
  }

  async banBlogBySA(dto: BanBlogDbDto) {
    const { blogId, isBanned, banDate } = dto;

    return this.dataSource.query(
      `
    update ${BLOGS_TABLE}
    set is_ban = $2, ban_date = $3
    where id = $1
    `,
      [blogId, isBanned, banDate],
    );
  }

  async checkBlogById(blogId: string): Promise<BlogDb> {
    const result = await this.dataSource.query(
      `
    select * from ${BLOGS_TABLE} where id = $1
    `,
      [blogId],
    );

    return result[0];
  }

  async checkBlogByPostId(postId: string): Promise<BlogDb> {
    const result = await this.dataSource.query(
      `
    select b.* from ${POSTS_TABLE} p
    left join ${BLOGS_TABLE} b on p.blog_id = b.id
    where p.id = $1
    `,
      [postId],
    );

    console.log(result[0]);

    return result[0];
  }
}
