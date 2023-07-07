import path from 'path';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MulterFileType } from '../../../types/file.interface';
import { ImgData } from '../../../types/img.data.interface';
import { SETTINGS } from '../../../utils/settings';
import { AwsS3BucketService } from '../../aws/aws.bucke.service';
import { PostsService } from '../../posts/posts.service';
import { PostsRepo } from '../../posts/repositories/post.repo';
import { BlogsRepo } from '../repositories/blogs.repo';

const { POST_MAIN_IMAGES_BUCKET } = SETTINGS;

export class UploadPostMainImgCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public postId: string,
    public file: MulterFileType,
  ) {}
}

@CommandHandler(UploadPostMainImgCommand)
export class UploadPostMainImgUseCase
  implements ICommandHandler<UploadPostMainImgCommand>
{
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private configService: ConfigService,
    private s3Service: AwsS3BucketService,
    private postsService: PostsService,
  ) {}

  async execute({
    userId,
    blogId,
    postId,
    file,
  }: UploadPostMainImgCommand): Promise<{ main: ImgData[] }> {
    const blog = await this.blogsRepo.checkBlogById(blogId);

    if (!blog) throw new NotFoundException();

    if (blog.user_id !== userId) throw new ForbiddenException();

    const post = await this.postsRepo.checkPostById(postId);

    if (!post) throw new NotFoundException();

    const Bucket = this.configService.get(POST_MAIN_IMAGES_BUCKET);
    const Key = path.join(postId, file.originalname);
    const Body = file.buffer;

    await this.s3Service.uploadFile({ Bucket, Key, Body });

    const files = await this.s3Service.getFiles(Bucket, path.join(postId));

    const viewPostMainImg = await this.postsService.getPostMainImages(files);

    return { main: viewPostMainImg };
  }
}
