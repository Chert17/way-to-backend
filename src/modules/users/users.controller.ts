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
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../../infra/guards/auth/basic.auth.guard';
import { UserQueryPagination } from '../../utils/pagination/pagination';
import { CreateUserDto } from './dto/input/create.user.dto';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(BasicAuthGuard)
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
