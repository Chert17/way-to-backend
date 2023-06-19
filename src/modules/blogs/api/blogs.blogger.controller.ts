import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../../infra/decorators/params/req.user.decorator';
import { JwtAuthGuard } from '../../../infra/guards/jwt.auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { CreateBlogCommand } from '../use-case/create.blog.use-case';

@Controller('blogger')
@UseGuards(JwtAuthGuard)
export class BlogsBloggerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/blogs')
  async createBlog(@ReqUser() user: User, @Body() dto: CreateBlogDto) {
    return this.commandBus.execute(
      new CreateBlogCommand({ ...dto, userId: user.id }),
    );
  }
}
