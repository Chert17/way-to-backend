import request from 'supertest';

import { app } from '../../../src/setting';
import { STATUS_CODE } from '../../../src/utils/status.code';
import { BLOG_URL, validBlogCreateData } from '../../data/blog.data';

export const createBlog = async () =>
  await request(app)
    .post(BLOG_URL)
    .auth('admin', 'qwerty', { type: 'basic' })
    .send(validBlogCreateData)
    .expect(STATUS_CODE.CREATED);
