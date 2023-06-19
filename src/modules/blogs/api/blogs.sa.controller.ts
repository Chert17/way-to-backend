import { Controller } from '@nestjs/common';

import { BlogsService } from '../blogs.service';

@Controller('blogs')
export class BlogsSaController {
  constructor(private readonly blogsService: BlogsService) {}
}
