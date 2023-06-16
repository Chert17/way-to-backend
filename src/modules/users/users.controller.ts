import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../infra/guards/basic.auth.guard';
import { SaQueryPagination } from '../../utils/pagination/pagination';
import { BanUserDto } from './dto/ban.user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { BanUserCommand } from './use-case/ban.user.use-case';
import { CreateUserCommand } from './use-case/create.user.use-case';
import { DeleteUserCommand } from './use-case/delete.user.use-case';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}
  @Get()
  findAll(@Query() pagination: SaQueryPagination) {
    return this.usersQueryRepo.getAll(pagination);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banUser(@Param('userId') userId: string, @Body() dto: BanUserDto) {
    return this.commandBus.execute(new BanUserCommand({ userId, ...dto }));
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('userId') userId: string) {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
