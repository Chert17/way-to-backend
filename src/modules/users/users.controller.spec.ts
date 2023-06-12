import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', async () => {
    const res = await controller.create({
      login: 'qwe',
      email: 'qwe@gmail.com',
      password: 'qwe',
    });

    expect(controller).toBeDefined();
    expect(res.userId).toBeDefined();
    expect(res.userId).toBe(expect.any(String));
  });
});
