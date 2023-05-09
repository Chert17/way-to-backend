import request from 'supertest';

import { app } from '../../../src/setting';
import { validCommentsData } from '../../data/comment.data';
import { POST_URL } from '../../data/post.data';

export const createCommentByPost = async (
  postId: string,
  accessToken: string
) =>
  await request(app)
    .post(POST_URL + postId + '/comments')
    .auth(accessToken, { type: 'bearer' })
    .send(validCommentsData);
