import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreateBlogDto } from './dto/input/create.blog.dto';

@Schema({ _id: false, versionKey: false })
class BannedUsers {
  @Prop({ required: true, type: String })
  banUserId: string;

  @Prop({ required: true, type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String, default: null })
  banReason: string | null;

  @Prop({ type: Date, default: null, required: false })
  banDate: Date | null;
}

export const BannedUsersSchema = SchemaFactory.createForClass(BannedUsers);

@Schema({ _id: false, versionKey: false })
class BanInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String, default: null, required: false })
  banDate: string | null;
}

export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true, length: { max: 15 } })
  name: string;

  @Prop({ type: String, require: true, length: { max: 500 } })
  description: string;

  @Prop({ type: String, require: true, length: { max: 100 } })
  websiteUrl: string;

  @Prop({ type: Date, require: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Boolean, require: true, default: false })
  isMembership: boolean;

  @Prop({ required: true, type: BanInfoSchema, default: {} })
  banInfo: BanInfo;

  @Prop({ type: [BannedUsersSchema], default: [], required: true })
  bannedUsers: BannedUsers[];

  // можно создавать статик методы чтоб сразу выдавать на клиент готовый обьект без дополнительных запросов в базу
  static create(dto: CreateBlogDto) {
    const newBlog = new Blog();
    newBlog.name = dto.name;
    newBlog.description = dto.description;
    newBlog.websiteUrl = dto.websiteUrl;
    newBlog.createdAt = new Date();
    newBlog.isMembership = false;
    return newBlog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// db = {
//   blogs: [
//     {
//       id: 123,
//       userId: 1,
//       bannedUsers: [],
//     },
//     {
//       id: 456,
//       userId: 1,
//       bannedUsers: [{ banUserId: 2 }],
//     },
//   ],

//   users: [
//     { _id: 1, accauntData: { login: 'qwe' } },
//     { _id: 2, accauntData: { login: 'asd' } },
//   ],
// };
