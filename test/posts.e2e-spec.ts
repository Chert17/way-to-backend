import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { POST_URL } from './helpers/endpoints';
import { BlogTest, PostTest, UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

describe('posts e2e', () => {
  let server: any;

  let userTest: UserTest;
  let blogTest: BlogTest;
  let postTest: PostTest;

  beforeAll(async () => {
    process.env.THROTTLR_LIMIT = 1000 + '';

    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
    blogTest = new BlogTest(server, dataSource);
    postTest = new PostTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('get post by id', () => {
    it('should be returned post', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server).get(POST_URL + `/${post0.id}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: post0.id,
        title: post0.title,
        shortDescription: post0.shortDescription,
        content: post0.content,
        blogId: post0.blogId,
        blogName: post0.blogName,
        createdAt: post0.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: post0.extendedLikesInfo.newestLikes,
        },
      });
    });

    it("shouldn't returned post if not exist", async () => {
      const res = await request(server).get(
        POST_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`,
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't return post if ban blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await blogTest.createBanBlogs(1, [blog0.id]);

      const res = await request(server).get(POST_URL + `/${post0.id}`);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('get all posts', () => {
    it('should be returned posts', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0, post1] = await postTest.createPosts(
        2,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server).get(POST_URL);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: post1.id,
            title: post1.title,
            shortDescription: post1.shortDescription,
            content: post1.content,
            blogId: blog0.id,
            blogName: blog0.name,
            createdAt: post1.createdAt,
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: [],
            },
          },
          {
            id: post0.id,
            title: post0.title,
            shortDescription: post0.shortDescription,
            content: post0.content,
            blogId: blog0.id,
            blogName: blog0.name,
            createdAt: post0.createdAt,
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: [],
            },
          },
        ],
      });
    });
  });
});
