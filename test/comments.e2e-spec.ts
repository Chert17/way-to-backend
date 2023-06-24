import request from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { LikeStatus } from '../src/utils/like.status';
import { COMMENT_URL, SA_URL } from './helpers/endpoints';
import { errorsData } from './helpers/errors.data';
import {
  BlogTest,
  CommentTest,
  PostTest,
  UserTest,
  admin,
} from './helpers/fabrica';
import { myBeforeAll } from './helpers/my.before.all';

describe('posts e2e', () => {
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

  describe('like comment', () => {
    it('should be like comment', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Like })
        .auth(user0.accessToken, { type: 'bearer' });

      const getLikeRes = await request(server)
        .get(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      const res1 = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Dislike })
        .auth(user0.accessToken, { type: 'bearer' });

      const getDislikeRes = await request(server)
        .get(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getLikeRes.status).toBe(HttpStatus.OK);
      expect(getLikeRes.body).toEqual({
        id: comment0.id,
        content: comment0.content,
        commentatorInfo: {
          userId: user0.id,
          userLogin: user0.login,
        },
        createdAt: comment0.createdAt,
        likesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: LikeStatus.Like,
        },
      });
      expect(res1.status).toBe(HttpStatus.NO_CONTENT);
      expect(getDislikeRes.status).toBe(HttpStatus.OK);
      expect(getDislikeRes.body).toEqual({
        id: comment0.id,
        content: comment0.content,
        commentatorInfo: {
          userId: user0.id,
          userLogin: user0.login,
        },
        createdAt: comment0.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 1,
          myStatus: LikeStatus.Dislike,
        },
      });
    });

    it('should be like comment , but myStatus should be None if add like not me', async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Like })
        .auth(user0.accessToken, { type: 'bearer' });

      const getRes = await request(server)
        .get(COMMENT_URL + `/${comment0.id}`)
        .auth(user1.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.likesInfo.myStatus).toBe(LikeStatus.None);
    });

    it('should be like comment , but returned commnets like info without ban user', async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Like })
        .auth(user0.accessToken, { type: 'bearer' });

      const res1 = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Dislike })
        .auth(user1.accessToken, { type: 'bearer' });

      const beforeUserBan = await request(server)
        .get(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      await request(server)
        .put(SA_URL + `/${user1.id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true, banReason: 'banned user banned user' });

      const afterUserBan = await request(server)
        .get(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(res1.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeUserBan.status).toBe(HttpStatus.OK);
      expect(beforeUserBan.body.likesInfo).toEqual({
        likesCount: 1,
        dislikesCount: 1,
        myStatus: LikeStatus.Like,
      });
      expect(afterUserBan.status).toBe(HttpStatus.OK);
      expect(afterUserBan.body.likesInfo).toEqual({
        likesCount: 1,
        dislikesCount: 0,
        myStatus: LikeStatus.Like,
      });
    });

    it("shouldn't like comment with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: 'qweqwe' })
        .auth(user0.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("shouldn't like comment if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}/like-status`)
        .send({ likeStatus: LikeStatus.Dislike });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't like comment if not exist comment", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await commentTest.createComments(1, post0.id, user0.accessToken);

      const res = await request(server)
        .put(COMMENT_URL + '/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/like-status')
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ likeStatus: LikeStatus.Dislike });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('get comment by id', () => {
    it('should be returned comment', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server).get(COMMENT_URL + `/${comment0.id}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
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
      });
    });

    it("shouldn't returned comment if not exist", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await commentTest.createComments(1, post0.id, user0.accessToken);

      const res = await request(server).get(
        COMMENT_URL + '/8eb3bb41-99b3-4b00-bd23-2fd410dab21f/like-status',
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't returned comment if ban blog", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      await blogTest.createBanBlogs(1, [blog0.id]);

      const res = await request(server).get(COMMENT_URL + `/${comment0.id}`);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('update comment', () => {
    it('should be update comment', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ content: 'update comment update comment' });

      const getRes = await request(server).get(COMMENT_URL + `/${comment0.id}`);

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body.content).toEqual('update comment update comment');
    });

    it("shouldn't update comment with incorrect data", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ content: '' });

      const errors = errorsData('content');

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errors);
    });

    it("shouldn't update comments if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}`)
        .send({ content: 'update comment update comment' });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't update comment if other owner", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .put(COMMENT_URL + `/${comment0.id}`)
        .auth(user1.accessToken, { type: 'bearer' })
        .send({ content: 'update comment update comment' });

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't update comment if not exist", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await commentTest.createComments(1, post0.id, user0.accessToken);

      const res = await request(server)
        .put(COMMENT_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`)
        .auth(user0.accessToken, { type: 'bearer' })
        .send({ content: 'update comment update comment' });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('delete comment', () => {
    it('should be delete comment', async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const beforeGetRes = await request(server).get(
        COMMENT_URL + `/${comment0.id}`,
      );

      const res = await request(server)
        .delete(COMMENT_URL + `/${comment0.id}`)
        .auth(user0.accessToken, { type: 'bearer' });

      const afterGetRes = await request(server).get(
        COMMENT_URL + `/${comment0.id}`,
      );

      expect(res.status).toBe(HttpStatus.NO_CONTENT);
      expect(beforeGetRes.status).toBe(HttpStatus.OK);
      expect(beforeGetRes.body).toBeDefined();
      expect(afterGetRes.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("shouldn't delete comments if not auth", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server).delete(COMMENT_URL + `/${comment0.id}`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("shouldn't delete comment if other owner", async () => {
      const [user0, user1] = await userTest.createLoginUsers(2);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      const [comment0] = await commentTest.createComments(
        1,
        post0.id,
        user0.accessToken,
      );

      const res = await request(server)
        .delete(COMMENT_URL + `/${comment0.id}`)
        .auth(user1.accessToken, { type: 'bearer' });

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("shouldn't delete comment if not exist", async () => {
      const [user0] = await userTest.createLoginUsers(1);

      const [blog0] = await blogTest.createBlogs(1, user0.accessToken);

      const [post0] = await postTest.createPosts(
        1,
        user0.accessToken,
        blog0.id,
      );

      await commentTest.createComments(1, post0.id, user0.accessToken);

      const res = await request(server)
        .delete(COMMENT_URL + `/8eb3bb41-99b3-4b00-bd23-2fd410dab21f`)
        .auth(user0.accessToken, { type: 'bearer' });

      console.log(res.body);

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
