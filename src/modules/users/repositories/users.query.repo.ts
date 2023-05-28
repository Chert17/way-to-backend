import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { WithPagination } from '../../../types/pagination.interface';
import { tryConvertToObjectId } from '../../../utils/converter.object.id';
import { UserQueryPagination } from '../../../utils/pagination/pagination';
import { UserViewDto } from '../dto/view/user.view.dto';
import { User } from '../users.schema';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(
    pagination: UserQueryPagination,
  ): Promise<WithPagination<UserViewDto>> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = pagination;

    const query = [];

    if (searchEmailTerm) {
      query.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    if (searchLoginTerm) {
      query.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    const filter = { $or: query.length ? query : [{}] };

    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pagination.skip())
      .limit(pageSize)
      .lean();

    const totalCount = await this.userModel.countDocuments(filter);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: users.map(this._userMapping),
    };
  }

  async getUserById(userId: string) {
    const convertId = tryConvertToObjectId(userId);

    if (!convertId) return false;

    const user = await this.userModel.findById(convertId);

    return this._userMapping(user);
  }

  private _userMapping(user: DbType<User>): UserViewDto {
    const { _id, login, email, createdAt } = user;

    return {
      id: _id.toString(),
      login,
      email,
      createdAt,
    };
  }
}
