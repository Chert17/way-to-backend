import request from 'supertest';

import { BlogViewModel } from '../src/models/blogs.models';
import { CommentViewModel } from '../src/models/comments.models';
import { PostViewModel } from '../src/models/posts.models';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { AUTH_URL, validLoginData } from './data/auth.data';
import { COMMENT_URL, validCommentsData } from './data/comment.data';
import { paginationData } from './data/common.data';
import { POST_URL } from './data/post.data';
import { validUserData } from './data/user.data';
import { createBlog } from './helpers/blogs/create.blog';
import { deleteAllData } from './helpers/delete.all.data';
import { createCommentByPost } from './helpers/posts/create.comment.by.post';
import { createPost } from './helpers/posts/create.post';
import { createUser } from './helpers/users/create.user';

describe('comments', () => {
  beforeAll(async () => {
    deleteAllData();
  });
});

describe('comments', () => {
  let createdBlog: BlogViewModel;
  let createdPost: PostViewModel;
  let createdComment: CommentViewModel;

  beforeAll(async () => {
    deleteAllData();
  });

  it('POST -> "/posts/:postId/comments": should create new comment; status 201; content: created comment; used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:commentId', async () => {
    await createUser();

    const loginResponse = await request(app)
      .post(AUTH_URL + '/login')
      .send(validLoginData);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual({ accessToken: expect.any(String) });
    const { accessToken } = loginResponse.body;

    const blog = await createBlog();

    createdBlog = blog.body;

    const post = await createPost(createdBlog.id);

    createdPost = post.body;

    const createCommentResponse = await createCommentByPost(
      createdPost.id,
      accessToken
    );

    expect(createCommentResponse).toBeDefined;
    expect(createCommentResponse.status).toBe(STATUS_CODE.CREATED);
    expect(createCommentResponse.body).toEqual({
      id: expect.any(String),
      content: validCommentsData.content,
      postId: createdPost.id,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: validUserData.login,
      },
      createdAt: expect.any(String),
    });

    createdComment = createCommentResponse.body;

    await request(app)
      .get(COMMENT_URL + createdComment.id)
      .expect(STATUS_CODE.OK, createdComment);
  });

  it('GET -> "/posts/:postId/comments": should return status 200; content: comments with pagination', async () => {
    await request(app)
      .get(POST_URL + createdPost.id + '/comments')
      .expect(STATUS_CODE.OK)
      .expect({ ...paginationData, items: [createdComment] });
  });
});
