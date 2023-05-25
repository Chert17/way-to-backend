import { UserQueryPagination } from 'src/utils/pagination/pagination';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dto/input/create.user.dto';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Get()
  async getAll(@Query() pagination: UserQueryPagination) {
    return await this.usersQueryRepo.getAllUsers(pagination);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const result = await this.usersService.createUser(dto);

    return await this.usersQueryRepo.getUserById(result._id.toString());
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param() userId: string) {
    const result = await this.usersService.deleteUser(userId);

    if (!result) throw new NotFoundException();

    return;
  }
}
