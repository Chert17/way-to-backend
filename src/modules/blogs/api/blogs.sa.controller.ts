import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../../infra/guards/basic.auth.guard';
import { BanBlogDto } from '../dto/ban.blog.dto';
import { BanBlogBySaCommand } from '../use-case/ban.blog.by.sa.use-case';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:blogId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  banBlog(@Param('blogId') blogId: string, @Body() dto: BanBlogDto) {
    return this.commandBus.execute(new BanBlogBySaCommand({ ...dto, blogId }));
  }
}
