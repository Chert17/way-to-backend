import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../../../infra/guards/auth/basic.auth.guard';
import { UserQueryPagination } from '../../../utils/pagination/pagination';
import { BanUserDto } from '../dto/input/ban.user.dto';
import { CreateUserDto } from '../dto/input/create.user.dto';
import { UsersQueryRepo } from '../repositories/users.query.repo';
import { UsersService } from '../users.service';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersSAController {
  constructor(
    private usersQueryRepo: UsersQueryRepo,
    private usersService: UsersService,
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

  @Put('/:userId/ban')
  async banUser(@Param() userId: string, @Body() dto: BanUserDto) {
    return await this.usersService.banUser({ userId, ...dto });
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param() userId: string) {
    const result = await this.usersService.deleteUser(userId);

    if (!result) throw new NotFoundException();

    return;
  }
}
