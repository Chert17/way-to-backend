import request from 'supertest';

import { UserViewModel } from '../src/models/users.models';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { invalidId, paginationData } from './data/common.data';
import { USER_URL } from './data/user.data';
import { deleteAllData } from './helpers/delete.all.data';
import { createUser } from './helpers/users/create.user';

describe('users', () => {
  let createdUser: UserViewModel;

  beforeAll(async () => {
    await deleteAllData();
  });

  it('POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users', async () => {
    const user = await createUser();

    createdUser = user.body;

    await request(app)
      .get(USER_URL)
      .expect(STATUS_CODE.OK)
      .expect({ ...paginationData, items: [createdUser] });
  });

  it('DELETE -> "/users/:id": should delete user by id; status 204', async () => {
    await request(app)
      .delete(USER_URL + createdUser.id)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NO_CONTENT);
  });

  it('!POST, !DELETE -> "/users": should return error if auth credentials is incorrect; status 401', async () => {
    const agent = request.agent(app);

    await agent
      .post(USER_URL)
      .auth('qwe', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);

    await agent
      .delete(USER_URL + invalidId)
      .auth('qwe', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.UNAUTHORIZED);
  });

  it('!DELETE -> "/users/:id": should return error if :id from uri param not found; status 404', async () => {
    await request(app)
      .delete(USER_URL + invalidId)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('!POST -> "/users": should return error if passed body is incorrect; status 400', async () => {
    await request(app)
      .post(USER_URL)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({ login: 'qwe', password: 'qwe123' })
      .expect(STATUS_CODE.BAD_REQUEST)
      .expect({
        errorsMessages: [{ message: 'Invalid value', field: 'email' }],
      });
  });
});
