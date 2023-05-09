import request from 'supertest';

import { BlogViewModel } from '../src/models/blogs.models';
import { PostViewModel } from '../src/models/posts.models';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { invalidId, paginationData } from './data/common.data';
import { POST_URL, updatePostData, validPostData } from './data/post.data';
import { createBlog } from './helpers/blogs/create.blog';
import { deleteAllData } from './helpers/delete.all.data';
import { createPost } from './helpers/posts/create.post';

describe('posts', () => {
  let createdBlog: BlogViewModel;
  let createdPost: PostViewModel;

  beforeAll(async () => {
    await deleteAllData();
  });

  it('POST -> "/posts": should create new post for an existing blog; status 201; content: created post; used additional methods: POST -> /blogs, GET -> /posts/:id', async () => {
    const createBlogResponse = await createBlog();

    createdBlog = createBlogResponse.body;

    const post = await createPost(createdBlog.id);

    createdPost = post.body;

    await request(app)
      .get(POST_URL + createdPost.id)
      .expect(STATUS_CODE.OK, createdPost);
  });

  it('GET -> "/posts": should return status 200; content: posts array with pagination', async () => {
    await request(app)
      .get(POST_URL)
      .expect(STATUS_CODE.OK)
      .expect({ ...paginationData, items: [createdPost] });
  });

  it('PUT -> "/posts/:id": should update post by id; status 204', async () => {
    let updatePost: PostViewModel;

    const post = await request(app)
      .put(POST_URL + createdPost.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ ...updatePostData, blogId: createdBlog.id })
      .expect(STATUS_CODE.NO_CONTENT);

    updatePost = post.body;

    expect(updatePost);
  });

  it('!PUT, !DELETE, !GET -> "/posts/:id": should return error if :id from uri param not found; status 404', async () => {
    const agent = request.agent(app);

    await agent
      .put(POST_URL + invalidId)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ ...updatePostData, blogId: createdBlog.id })
      .expect(STATUS_CODE.NOT_FOUND);

    await agent
      .get(POST_URL + invalidId)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NOT_FOUND);

    await agent
      .delete(POST_URL + invalidId)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('!PUT, !POST, !DELETE -> "/posts": should return error if auth credentials is incorrect; status 401', async () => {
    const agent = request.agent(app);

    await agent
      .put(POST_URL + invalidId)
      .auth('qwe', 'qwerty', { type: 'basic' })
      .send({ ...updatePostData, blogId: createdBlog.id })
      .expect(STATUS_CODE.UNAUTHORIZED);

    await agent
      .post(POST_URL)
      .auth('qwe', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);

    await agent
      .delete(POST_URL + invalidId)
      .auth('qwe', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);
  });

  it('!POST -> "/posts": should return error if passed body is incorrect; status 400', async () => {
    await request(app)
      .post(POST_URL)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ ...validPostData, blogId: invalidId })
      .expect(STATUS_CODE.BAD_REQUEST)
      .expect({
        errorsMessages: [
          { message: 'Blog with given id not found', field: 'blogId' },
        ],
      });
  });

  it('!PUT -> "/posts": should return error if passed body is incorrect; status 400', async () => {
    await request(app)
      .post(POST_URL)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ ...validPostData, blogId: invalidId })
      .expect(STATUS_CODE.BAD_REQUEST)
      .expect({
        errorsMessages: [
          { message: 'Blog with given id not found', field: 'blogId' },
        ],
      });
  });
});
