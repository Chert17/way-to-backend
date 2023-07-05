import sharp from 'sharp';
import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { LikeStatus } from '../src/utils/like.status';
import { KbIMg, PandaImg } from './helpers/assets';
import {
  BLOG_URL,
  POST_URL,
  SABlogsEndpoints,
  bloggerEndpoints,
} from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import {
  BlogTest,
  CommentTest,
  PostTest,
  UserTest,
  admin,
} from './helpers/fabrica';
import { getImgFromAssets } from './helpers/get-img';
import { myBeforeAll } from './helpers/my.before.all';

const { BLOGGER_BLOGS_URL, BLOGGER_USERS_URL, GET_ALL_BAN_USERS_BY_BLOG_URL } =
  bloggerEndpoints;

const { SA_BAN_BLOG_URL, SA_GET_ALL_BAN_BLOGS_URL } = SABlogsEndpoints;

describe('blogger e2e', () => {
  let server: any;

  let userTest: UserTest;
  let blogTest: BlogTest;
  let postTest: PostTest;
  let commentTest: CommentTest;

  beforeAll(async () => {
    process.env.THROTTLR_LIMIT = 1000 + '';

    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
    blogTest = new BlogTest(server, dataSource);
    postTest = new PostTest(server, dataSource);
    commentTest = new CommentTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('create blog', () => {
    it('should be create blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ ...blogData });

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it("shouldn't create blog with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ name: blogData.name, description: blogData.description });

      const errors = errorsData('websiteUrl');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't create blog if no auth", async () => {
      const res = await request(server).post(BLOGGER_BLOGS_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get all blogs', () => {
    it('get all blogs with pagination', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0, blog1] = await blogTest.createBlogs(2, user0.accessToken);

      const res = await request(server)
        .get(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: blog1.id,
            name: blog1.name,
            description: blog1.description,
            websiteUrl: blog1.websiteUrl,
            createdAt: blog1.createdAt,
            isMembership: blog1.isMembership,
          },
          {
            id: blog0.id,
            name: blog0.name,
            description: blog0.description,
            websiteUrl: blog0.websiteUrl,
            createdAt: blog0.createdAt,
            isMembership: blog0.isMembership,
          },
        ],
      });

      const res1 = await request(server)
        .get(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' })
        .query({ sortDirection: 'asc', pageSize: 1 });

      expect(res1.status).toBe(HttpStatus.OK);
      expect(res1.body).toEqual({
        pagesCount: 2,
        page: 1,
        pageSize: 1,
        totalCount: 2,
        items: [
          {
            id: blog0.id,
            name: blog0.name,
            description: blog0.description,
            websiteUrl: blog0.websiteUrl,
            createdAt: blog0.createdAt,
            isMembership: blog0.isMembership,
          },
        ],
      });
    });

    it("shouldn't get all blogs if not auth", async () => {
      const res = await request(server).get(BLOGGER_BLOGS_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('update blog', () => {
    it('should be update blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send(blogData);

      const getRes = await request(server).get(BLOG_URL + `/${blog0.id}`);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body).toEqual({
        id: blog0.id,
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: blog0.createdAt,
        isMembership: blog0.isMembership,
      });
    });

    it("shouldn't update blog with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({
          name: '',
          description: 'string',
          websiteUrl: 'https://CfpnAx36q8NOMIfxZgSffKmh1djdfQqlFvEcglSvVi',
        });

      const errors = errorsData('name');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't update blog if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).put(BLOGGER_BLOGS_URL + `/${blog0.id}`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't update blog if other owner", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}`)
        .auth(user1.accessToken, { type: 'bearer' })
        .send(blogData);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't update blog if not exist", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      await blogTest.createBlogs(1, user0.accessToken);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send(blogData);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('delete blog', () => {
    it('should be delete blog by id', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const beforeGetRes = await request(server)
        .get(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' });

      const res = await request(server)
        .delete(BLOGGER_BLOGS_URL + `/${blog0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      const getRes = await request(server)
        .get(BLOGGER_BLOGS_URL)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeGetRes.status).toBe(HttpStatus.OK);
      expect(beforeGetRes.body.items).toHaveLength(1);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.items).toHaveLength(0);
    });

    it("shouldn't delete blog if not exist", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .delete(BLOGGER_BLOGS_URL + '/8eb3bb41-99b3-4b00-bd23-2fd410dab21f')
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't delete blog if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).delete(
        BLOGGER_BLOGS_URL + `/${blog0.id}`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't delete blog if other owner", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .delete(BLOGGER_BLOGS_URL + `/${blog0.id}`)
        .auth(user1.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('create post for blog', () => {
    it('should be create post for blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const postData = postTest._createPostData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${blog0.id}/posts`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        title: postData.title,
        shortDescription: postData.shortDescription,
        content: postData.content,
        blogId: blog0.id,
        blogName: blog0.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });

    it("shouldn't create post with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const postData = postTest._createPostData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${blog0.id}/posts`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({
          title: postData.title,
          shortDescription: postData.shortDescription,
          content: '',
        });

      const errors = errorsData('content');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't create post if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).post(
        BLOGGER_BLOGS_URL + `/${blog0.id}/posts`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't create post if other owner blog", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const postData = postTest._createPostData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${blog0.id}/posts`)
        .auth(user1.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't create post if not exist blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      await blogTest.createBlogs(1, user0.accessToken);

      const postData = postTest._createPostData();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/posts`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('update post by blog', () => {
    it('should be update post', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const postData = postTest._createPostData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send(postData);

      const getRes = await request(server).get(POST_URL + `/${post0.id}`);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body).toEqual({
        id: post0.id,
        title: postData.title,
        shortDescription: postData.shortDescription,
        content: postData.content,
        blogId: blog0.id,
        blogName: blog0.name,
        createdAt: post0.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: post0.extendedLikesInfo.newestLikes,
        },
      });
    });

    it("shouldn't update post with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const postData = postTest._createPostData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({
          content: postData.content,
          shortDescription: postData.shortDescription,
        });

      const errors = errorsData('title');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't update post if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server).put(
        BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't update post if other owner blog", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const postData = postTest._createPostData();

      const res = await request(server)
        .put(BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`)
        .auth(user1.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't update post if not exist post", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      await postTest.createPosts(1, user0.accessToken, blog0.id);

      const postData = postTest._createPostData();

      const res = await request(server)
        .put(
          BLOGGER_BLOGS_URL +
            `/${blog0.id}/posts/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`,
        )
        .auth(user0.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't update post if not exist blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const postData = postTest._createPostData();

      const res = await request(server)
        .put(
          BLOGGER_BLOGS_URL +
            `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/posts/${post0.id}`,
        )
        .auth(user0.accessToken, { type: 'bearer' })
        .send(postData);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('delete post by blog', () => {
    it('should be delete post', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const beforeGetRes = await request(server).get(POST_URL);

      const res = await request(server)
        .delete(BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      const afterGetRes = await request(server).get(POST_URL);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeGetRes.status).toBe(HttpStatus.OK);
      expect(beforeGetRes.body.items).toHaveLength(1);
      expect(afterGetRes.status).toBe(HttpStatus.OK);
      expect(afterGetRes.body.items).toHaveLength(0);
    });

    it("shouldn't delete post in not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server).delete(
        BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't delete post if other owner blog", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server)
        .delete(BLOGGER_BLOGS_URL + `/${blog0.id}/posts/${post0.id}`)
        .auth(user1.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't delete post if not exist post", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      await postTest.createPosts(1, user0.accessToken, blog0.id);

      const res = await request(server)
        .delete(
          BLOGGER_BLOGS_URL +
            `/${blog0.id}/posts/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`,
        )
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't delete post if not exist blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server)
        .delete(
          BLOGGER_BLOGS_URL +
            `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/posts/${post0.id}`,
        )
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('ban user for blog by blogger', () => {
    it('shoul be banned user for blog', async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .put(BLOGGER_USERS_URL + `/${user1.id}/ban`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({
          isBanned: true,
          banReason: 'test ban user for blog by blogger',
          blogId: blog0.id,
        });

      //TODO add check logic for create comment by ban user for blog

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("shouldn't ban user wiyh incorrect data", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .put(BLOGGER_USERS_URL + `/${user1.id}/ban`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ isBanned: true });

      const errors = errorsData('banReason', 'blogId');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't ban user if not auth", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).put(
        BLOGGER_USERS_URL + `/${user1.id}/ban`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get all banned users by blog', () => {
    it('should be returned all banned users by blog', async () => {
      const [user0, user1, user2] = await userTest.createLoginUsers(3);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      await blogTest.createBanUsersForBlog(2, user0.accessToken, blog0.id, [
        user1.id,
        user2.id,
      ]);

      const res = await request(server)
        .get(GET_ALL_BAN_USERS_BY_BLOG_URL + `/${blog0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: user2.id,
            login: user2.login,
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(String),
            },
          },
          {
            id: user1.id,
            login: user1.login,
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
              banReason: expect.any(String),
            },
          },
        ],
      });
    });

    it("shouldn't returned ban users if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(3);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).get(
        GET_ALL_BAN_USERS_BY_BLOG_URL + `/${blog0.id}`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get all comments by blogger blog', () => {
    it('should be returned all comments by blogger blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0, blog1] = await blogTest.createBlogs(2, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [post1] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog1.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const [comment1] = await commentTest.createComments(
        1,
        post1.id,
        user0.accessToken,
      );

      const res = await request(server)
        .get(BLOGGER_BLOGS_URL + '/comments')
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: comment1.id,
            content: comment1.content,
            commentatorInfo: {
              userId: user0.id,
              userLogin: user0.login,
            },
            createdAt: comment1.createdAt,
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: LikeStatus.None,
            },
            postInfo: {
              id: post1.id,
              title: post1.title,
              blogId: blog1.id,
              blogName: blog1.name,
            },
          },
          {
            id: comment0.id,
            content: comment0.content,
            commentatorInfo: {
              userId: user0.id,
              userLogin: user0.login,
            },
            createdAt: comment0.createdAt,
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: LikeStatus.None,
            },
            postInfo: {
              id: post0.id,
              title: post0.title,
              blogId: blog0.id,
              blogName: blog0.name,
            },
          },
        ],
      });
    });

    it("shouldn't returned all comments by blogger blog if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await commentTest.createComments(1, post0.id, user0.accessToken);

      const res = await request(server).get(BLOGGER_BLOGS_URL + '/comments');

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('upload wallpaper for blog and save in db', () => {
    it('should be upload file and returned view model', async () => {
      const [u0] = await userTest.createLoginUsers(1);
      const [b0] = await blogTest.createBlogs(1, u0.accessToken);

      const file = await getImgFromAssets(PandaImg);

      const fileData = await sharp(file).metadata();

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${b0.id}/images/wallpaper`)
        .auth(u0.accessToken, { type: 'bearer' })
        .attach('file', file);

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        wallpaper: {
          url: expect.any(String),
          width: fileData.width,
          height: fileData.height,
          fileSize: fileData.size,
        },
        main: [],
      });
    });

    it("shouldn't upload file with incorrect data", async () => {
      const [u0] = await userTest.createLoginUsers(1);
      const [b0] = await blogTest.createBlogs(1, u0.accessToken);

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${b0.id}/images/wallpaper`)
        .auth(u0.accessToken, { type: 'bearer' })
        .attach('file', '');

      const errors = errorsData('file');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't upload file if not auth", async () => {
      const [u0] = await userTest.createLoginUsers(1);
      const [b0] = await blogTest.createBlogs(1, u0.accessToken);

      const file = await getImgFromAssets(PandaImg);

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${b0.id}/images/wallpaper`)
        .attach('file', file);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't upload file if other owner blog", async () => {
      const [u0, u1] = await userTest.createLoginUsers(2);
      const [b0] = await blogTest.createBlogs(1, u0.accessToken);

      const file = await getImgFromAssets(KbIMg);

      const res = await request(server)
        .post(BLOGGER_BLOGS_URL + `/${b0.id}/images/wallpaper`)
        .auth(u1.accessToken, { type: 'bearer' })
        .attach('file', file);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
});

describe('public blogs e2e', () => {
  let server: any;

  let userTest: UserTest;
  let blogTest: BlogTest;
  let postTest: PostTest;

  beforeAll(async () => {
    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
    blogTest = new BlogTest(server, dataSource);
    postTest = new PostTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('get blog by id', () => {
    it('should be returned blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0, blog1] = await blogTest.createBlogs(2, user0.accessToken);

      await blogTest.createBanBlogs(1, [blog1.id]);

      const res = await request(server).get(BLOG_URL + `/${blog0.id}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: blog0.id,
        name: blog0.name,
        description: blog0.description,
        websiteUrl: blog0.websiteUrl,
        createdAt: blog0.createdAt,
        isMembership: blog0.isMembership,
      });
    });

    it("shouldn't returned blog if not exist", async () => {
      const res = await request(server).get(
        BLOG_URL + '/8eb3bb41-99b3-4b00-bd23-2fd410dab21f',
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('get all blogs', () => {
    it('should be returned all blogs exact ban blogs', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0, blog1] = await blogTest.createBlogs(2, user0.accessToken);

      await blogTest.createBanBlogs(1, [blog1.id]);

      const res = await request(server).get(BLOG_URL).query({ pageSize: 1 });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.items).toHaveLength(1);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 1,
        totalCount: 1,
        items: [
          {
            id: blog0.id,
            name: blog0.name,
            description: blog0.description,
            websiteUrl: blog0.websiteUrl,
            createdAt: blog0.createdAt,
            isMembership: blog0.isMembership,
          },
        ],
      });
    });
  });

  describe('get all posts by blog', () => {
    it('should be retutned all posts by blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const res = await request(server).get(BLOG_URL + `/${blog0.id}/posts`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
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
          },
        ],
      });
    });

    it("shoulbn't returned posts if ban blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      await postTest.createPosts(1, user0.accessToken, blog0.id);

      await blogTest.createBanBlogs(1, [blog0.id]);

      const res = await request(server).get(BLOG_URL + `/${blog0.id}/posts`);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't returned posts if not exist blog", async () => {
      const res = await request(server).get(
        BLOG_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/posts`,
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});

describe(' blogs sa e2e', () => {
  let server: any;

  let userTest: UserTest;
  let blogTest: BlogTest;

  beforeAll(async () => {
    process.env.THROTTLR_LIMIT = 1000 + '';

    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
    blogTest = new BlogTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('ban blog', () => {
    it('should be ban blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const beforeGetRes = await request(server).get(BLOG_URL + `/${blog0.id}`);

      const res = await request(server)
        .put(SA_BAN_BLOG_URL + `/${blog0.id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true });

      const afterGetRes = await request(server).get(BLOG_URL + `/${blog0.id}`);

      const unbanRes = await request(server)
        .put(SA_BAN_BLOG_URL + `/${blog0.id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: false });

      const beforeUnbanRes = await request(server).get(
        BLOG_URL + `/${blog0.id}`,
      );

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeGetRes.status).toBe(HttpStatus.OK);
      expect(beforeGetRes.body).toBeDefined();
      expect(afterGetRes.status).toBe(HttpStatus.NOT_FOUND);
      expect(unbanRes.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeUnbanRes.status).toBe(HttpStatus.OK);
      expect(beforeUnbanRes.body).toBeDefined();
    });

    it("shouldn't ban blog with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server)
        .put(SA_BAN_BLOG_URL + `/${blog0.id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: 'qweqwe' });

      const errors = errorsData('isBanned');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't ban blog if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).put(
        SA_BAN_BLOG_URL + `/${blog0.id}/ban`,
      );

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('get all blogs', () => {
    it('should be returned all ban blogs by sa', async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0, blog1] = await blogTest.createBlogs(2, user0.accessToken);
      const [blog2] = await blogTest.createBlogs(1, user1.accessToken);

      await blogTest.createBanBlogs(2, [blog0.id, blog1.id]);

      const res = await request(server)
        .get(SA_GET_ALL_BAN_BLOGS_URL)
        .auth(admin.login, admin.password, { type: 'basic' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [
          {
            id: blog2.id,
            name: blog2.name,
            description: blog2.description,
            websiteUrl: blog2.websiteUrl,
            createdAt: blog2.createdAt,
            isMembership: blog2.isMembership,
            blogOwnerInfo: {
              userId: user1.id,
              userLogin: user1.login,
            },
            banInfo: {
              isBanned: false,
              banDate: null,
            },
          },
          {
            id: blog1.id,
            name: blog1.name,
            description: blog1.description,
            websiteUrl: blog1.websiteUrl,
            createdAt: blog1.createdAt,
            isMembership: blog1.isMembership,
            blogOwnerInfo: {
              userId: user0.id,
              userLogin: user0.login,
            },
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
            },
          },
          {
            id: blog0.id,
            name: blog0.name,
            description: blog0.description,
            websiteUrl: blog0.websiteUrl,
            createdAt: blog0.createdAt,
            isMembership: blog0.isMembership,
            blogOwnerInfo: {
              userId: user0.id,
              userLogin: user0.login,
            },
            banInfo: {
              isBanned: true,
              banDate: expect.any(String),
            },
          },
        ],
      });
    });

    it("shouldn't returned all blogs if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      await blogTest.createBanBlogs(1, [blog0.id]);

      const res = await request(server).get(SA_GET_ALL_BAN_BLOGS_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
