import request from 'supertest';
import { EntityManager } from 'typeorm';

import { faker } from '@faker-js/faker';

import { Device } from '../../src/modules/users/entities/devices';
import { UsersSqlTables } from '../../src/utils/tables/users.sql.tables';
import { authEndpoints, bloggerEndpoints, SA_URL } from './endpoints';
import { getRefreshToken } from './get.refresh.token';

const { LOGIN_URL } = authEndpoints;
const { BLOGGER_BLOGS_URL } = bloggerEndpoints;

const {
  USERS_CONFIRM_EMAIL_TABLE,
  USERS_TABLE,
  USERS_DEVICES_TABLE,
  USERS_RECOVERY_PASS_TABLE,
} = UsersSqlTables;

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

interface LoginUserWithTokens extends User {
  accessToken: string;
  refreshToken: string;
  userAgent: string;
}

type DeviceWithTokens = LoginUserWithTokens;

interface Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
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

  async createLoginUsers(quantity: number): Promise<LoginUserWithTokens[]> {
    const result = [];

    const users = await this.createUsers(quantity);

    for (let i = 0; i < quantity; i++) {
      const res = await request(this.server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: users[i].email, password: users[i].password })
        .set('User-Agent', `my test${i}`);

      const { value } = getRefreshToken(res);

      result.push({
        ...users[i],
        accessToken: res.body.accessToken,
        refreshToken: value,
        userAgent: `my test${i}`,
      });
    }

    return result;
  }

  async createDevices(quantity: number): Promise<DeviceWithTokens[]> {
    const result = [];

    const [users0] = await this.createUsers(1);

    for (let i = 0; i < quantity; i++) {
      const res = await request(this.server)
        .post(LOGIN_URL)
        .send({ loginOrEmail: users0.email, password: users0.password })
        .set('User-Agent', `my test${i}`);

      const { value } = getRefreshToken(res);

      result.push({
        ...users0,
        accessToken: res.body.accessToken,
        refreshToken: value,
        userAgent: `my test${i}`,
      });
    }

    return result;
  }

  async getConfirmEmailCode(email: string): Promise<{ confirmCode: string }> {
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

  async getUserDevices(): Promise<Device[]> {
    return this.dataSource.query(`select * from ${USERS_DEVICES_TABLE}`);
  }

  async getRecoveryCode(email: string): Promise<{ recoveryCode: string }> {
    const code = await this.dataSource.query(
      `
    select p.recovery_code from ${USERS_RECOVERY_PASS_TABLE} p
    left join ${USERS_TABLE} u on p.user_id = u.id
    where u.email = $1
    `,
      [email],
    );

    return { recoveryCode: code[0]?.recovery_code ?? null };
  }

  _createtUserData() {
    return {
      login: faker.person.firstName(), //`user`,
      email: faker.internet.email(), //`user@email.com`,
      password: faker.internet.password(), //`password`,
    };
  }
}

export class BlogTest {
  constructor(
    private readonly server: any,
    private dataSource?: EntityManager,
  ) {}

  async createBlogs(quantity: number, accessToken: string): Promise<Blog[]> {
    const blogs: Blog[] = [];

    for (let i = 0; i < quantity; i++) {
      const blogData = this._createBlogData();

      const res = await request(this.server)
        .post(BLOGGER_BLOGS_URL)
        .auth(accessToken, { type: 'bearer' })
        .send(blogData);

      blogs.push({
        id: res.body.id,
        createdAt: res.body.createdAt,
        isMembership: res.body.isMembership,
        ...blogData,
      });
    }

    return blogs;
  }

  _createBlogData() {
    return {
      name: faker.person.firstName(),
      description: faker.lorem.paragraph(),
      websiteUrl: faker.internet.url(),
    };
  }
}
