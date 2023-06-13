import request from 'supertest';

import { faker } from '@faker-js/faker';

import { SA_URL } from './endpoints';

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
  constructor(private readonly server: any) {}

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

  private _createtUserData() {
    return {
      login: faker.person.firstName(), //`user`,
      email: faker.internet.email(), //`user@email.com`,
      password: faker.internet.password(), //`password`,
    };
  }
}
