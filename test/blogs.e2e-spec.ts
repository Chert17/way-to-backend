import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { bloggerEndpoints } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import { BlogTest, UserTest } from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

const { CREATE_BLOG_URL } = bloggerEndpoints;

describe('blogs e2e', () => {
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

  describe('create blog', () => {
    it('should be create blog', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const blogData = blogTest._createBlogData();

      const res = await request(server)
        .post(CREATE_BLOG_URL)
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
        .post(CREATE_BLOG_URL)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ name: blogData.name, description: blogData.description });

      const errors = errorsData('websiteUrl');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't create blog if no auth", async () => {
      const res = await request(server).post(CREATE_BLOG_URL);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
