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
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../../infra/guards/basic.auth.guard';
import { BanUserDto } from './dto/ban.user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banUser(@Param('userId') userId: string, @Body() dto: BanUserDto) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {}
}
