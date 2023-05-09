import request from 'supertest';

import { BlogViewModel } from '../src/models/blogs.models';
import { PostViewModel } from '../src/models/posts.models';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import {
  BLOG_URL,
  updateBlogData,
  validBlogCreateData,
  validWebsiteUrl,
} from './data/blog.data';
import { invalidId, paginationData } from './data/common.data';
import { POST_URL, validPostData } from './data/post.data';
import { createBlog } from './helpers/blogs/create.blog';
import { createPostByBlog } from './helpers/blogs/create.post.by.blog';
import { deleteAllData } from './helpers/delete.all.data';

describe('blogs', () => {
  let createdBlog: BlogViewModel;
  let createdPost: PostViewModel;

  beforeAll(async () => {
    await deleteAllData();
  });

  it('POST -> "/blogs": should create new blog; status 201; content: created blog; used additional methods: GET -> /blogs/:id', async () => {
    const blog = await createBlog();

    createdBlog = blog.body;

    expect(createdBlog).toEqual({
      id: expect.any(String),
      ...validBlogCreateData,
      createdAt: expect.any(String),
      isMembership: false,
    });

    await request(app)
      .get(BLOG_URL + createdBlog.id)
      .expect(STATUS_CODE.OK, createdBlog);
  });

  it('POST -> "/blogs/:blogId/posts": should create new post for specific blog; status 201; content: created post; used additional methods: POST -> /blogs, GET -> /posts/:id', async () => {
    const post = await createPostByBlog(createdBlog.id);

    createdPost = post.body;

    expect(createdPost).toEqual({
      id: expect.any(String),
      ...validPostData,
      createdAt: expect.any(String),
      blogName: createdBlog.name,
      blogId: expect.any(String),
    });

    await request(app)
      .get(POST_URL + createdPost.id)
      .expect(STATUS_CODE.OK, createdPost);
  });

  it('!GET -> "/blogs/:blogId/posts": should return error if :id from uri param not found; status 404', async () => {
    await request(app)
      .get(BLOG_URL + invalidId + '/posts')
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('GET -> "/blogs/:blogId/posts": should return status 200; content: posts for specific blog with pagination;', async () => {
    await request(app)
      .get(BLOG_URL + createdBlog.id + '/posts')
      .expect(STATUS_CODE.OK)
      .expect({ ...paginationData, items: [createdPost] });
  });

  it('!PUT, !POST, !DELETE -> "/blogs": should return error if auth credentials is incorrect; status 401', async () => {
    const agent = request.agent(app);

    await agent
      .put(BLOG_URL + createdBlog.id)
      .auth('qwe', 'qwe', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);

    await agent
      .post(BLOG_URL)
      .auth('qwe', 'qwe', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);

    await agent
      .delete(BLOG_URL + createdBlog.id)
      .auth('qwe', 'qwe', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);
  });

  it('PUT -> "/blogs/:id": should update blog by id; status 204', async () => {
    await request(app)
      .put(BLOG_URL + createdBlog.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(updateBlogData)
      .expect(STATUS_CODE.NO_CONTENT);
  });

  it('DELETE -> "/blogs/:id": should delete blog by id; status 204', async () => {
    await request(app)
      .delete(BLOG_URL + createdBlog.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NO_CONTENT);
  });

  it('!GET -> "/blogs/:id": should return error if :id from uri param not found; status 404', async () => {
    await request(app)
      .get(BLOG_URL + createdBlog.id)
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('!DELETE -> "/blogs/:id": should return error if :id from uri param not found; status 404', async () => {
    await request(app)
      .delete(BLOG_URL + createdBlog.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('!POST -> "/blogs": should return error if passed body is incorrect; status 400', async () => {
    await request(app)
      .post(BLOG_URL)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ description: 'update', name: 'update' })
      .expect(STATUS_CODE.BAD_REQUEST)
      .expect({
        errorsMessages: [{ message: 'Invalid value', field: 'websiteUrl' }],
      });
  });

  it('!PUT -> "/blogs": should return error if passed body is incorrect; status 400', async () => {
    let Blog: BlogViewModel;

    const blog = await createBlog();

    Blog = blog.body;

    await request(app)
      .put(BLOG_URL + Blog.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ description: 'update', websiteUrl: validWebsiteUrl })
      .expect(STATUS_CODE.BAD_REQUEST)
      .expect({
        errorsMessages: [{ message: 'Invalid value', field: 'name' }],
      });
  });
});
