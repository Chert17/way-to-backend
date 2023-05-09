import request from 'supertest';

import { app } from '../../../src/setting';
import { STATUS_CODE } from '../../../src/utils/status.code';
import { POST_URL, validPostData } from '../../data/post.data';

export const createPost = async (blogId: string) =>
  await request(app)
    .post(POST_URL)
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ ...validPostData, blogId: blogId })
    .expect(STATUS_CODE.CREATED);
