import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { PostViewDto } from '../dto/post.view.dto';

@Injectable()
export class PostsQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPostById(userId: string, postId: string): Promise<PostViewDto> {
    const result = await this.dataSource.query(
      `
    select p.id, p.title, p.short_descr as "shortDescription", p.content, p.created_at as "createdAt", p.blog_id as "blogId", b.title as "blogName"
    from posts p
    left join blogs b on p.blog_id = b.id
    where p.id = $1
    `,
      [postId],
    );

    return {
      ...result[0],
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
