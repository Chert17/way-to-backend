import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { BLOG_URL, bloggerEndpoints } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import { BlogTest, UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

const { BLOGGER_BLOGS_URL } = bloggerEndpoints;

describe('blogger e2e', () => {
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
  });
});

describe('public blogs e2e', () => {
  let server: any;

  let userTest: UserTest;
  let blogTest: BlogTest;

  beforeAll(async () => {
    const { myServer, dataSource } = await myBeforeAll();

    server = myServer;

    userTest = new UserTest(server, dataSource);
    blogTest = new BlogTest(server, dataSource);
  });

  beforeEach(async () => {
    await request(server).delete('/api/testing/all-data');
  });

  describe('get blog by id', () => {
    it('should be returned blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const res = await request(server).get(BLOG_URL + `/${blog0.id}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(blog0);
    });

    it("shouldn't returned blog if not exist", async () => {
      const res = await request(server).get(
        BLOG_URL + '/8eb3bb41-99b3-4b00-bd23-2fd410dab21f',
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
