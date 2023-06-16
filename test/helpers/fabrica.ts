import request from 'supertest';
import { EntityManager } from 'typeorm';

import { faker } from '@faker-js/faker';

import { UsersSqlTables } from '../../src/utils/tables/users.sql.tables';
import { SA_URL } from './endpoints';

const { USERS_CONFIRM_EMAIL_TABLE, USERS_TABLE } = UsersSqlTables;

export const admin = {
  login: 'admin',
  password: 'qwerty',
};

interface User {
  id: string;
  login: string;
  email: string;
  password: string;
}

export class UserTest {
  constructor(
    private readonly server: any,
    private dataSource?: EntityManager,
  ) {}

  async createUsers(quantity: number) {
    const users: User[] = [];

    for (let i = 0; i < quantity; i++) {
      const userData = this._createtUserData();

      const res = await request(this.server)
        .post(SA_URL)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send(userData);

      users.push({ id: res.body.id, ...userData });
    }

    return users;
  }

  async createBanUsers(quantity: number) {
    const users = await this.createUsers(quantity);

    for (let i = 0; i < quantity; i++) {
      await request(this.server)
        .put(SA_URL + `/${users[i].id}/ban`)
        .auth(admin.login, admin.password, { type: 'basic' })
        .send({ isBanned: true, banReason: 'banned user banned user' });
    }

    return users;
  }

  async getConfirmEmailCodeByUser(
    email: string,
  ): Promise<{ confirmCode: string }> {
    const code = await this.dataSource.query(
      `
    select e.confirm_code from ${USERS_CONFIRM_EMAIL_TABLE} e
    left join ${USERS_TABLE} u on  e.user_id = u.id
    where u.email = $1
    `,
      [email],
    );

    return { confirmCode: code[0].confirm_code };
  }

  _createtUserData() {
    return {
      login: faker.person.firstName(), //`user`,
      email: faker.internet.email(), //`user@email.com`,
      password: faker.internet.password(), //`password`,
    };
  }
}
