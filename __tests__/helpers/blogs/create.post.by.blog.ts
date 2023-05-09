import request from 'supertest';

import { app } from '../../../src/setting';
import { STATUS_CODE } from '../../../src/utils/status.code';
import { BLOG_URL } from '../../data/blog.data';
import { validPostData } from '../../data/post.data';

export const createPostByBlog = async (blogId: string) =>
  await request(app)
    .post(BLOG_URL + blogId + '/posts')
    .auth('admin', 'qwerty', { type: 'basic' })
    .send({ blogId: blogId, ...validPostData })
    .expect(STATUS_CODE.CREATED);
