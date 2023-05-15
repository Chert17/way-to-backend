import { ObjectId, WithId } from 'mongodb';

import { IUserDb } from '../../db/db.types';
import { UserModel } from '../../db/schema-model/user.schema.model';
import { converterUser } from '../../helpers/converterToValidFormatData/converter.user';
import { UserViewModel } from '../../models/users.models';
import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const userQueryRepo = {
  async getAllUsers(
    login: string | null,
    email: string | null,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<UserViewModel>> {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    let query = [];

    if (email) {
      query.push({ email: { $regex: !email ? '' : email, $options: 'i' } });
    }

    if (login) {
      query.push({ login: { $regex: !login ? '' : login, $options: 'i' } });
    }

    const find = {
      $or: query.length ? query : [{}],
    };

    const users = await UserModel.find(find)
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await UserModel.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: users.map(converterUser),
    };
  },

  getUserById: async (id: string): Promise<UserViewModel | null> => {
    try {
      if (!ObjectId.isValid(id)) return null;

      const user = await UserModel.findOne({ _id: new ObjectId(id) }).lean();

      if (!user) return null;

      return converterUser(user);
    } catch (error) {
      return null;
    }
  },

  getUserByEmail: async (email: string): Promise<UserViewModel | null> => {
    try {
      const user = await UserModel.findOne({ email }).lean();

      if (!user) return null;

      return converterUser(user);
    } catch (error) {
      return null;
    }
  },

  checkUserCredentials: async (
    loginOrEmail: string
  ): Promise<WithId<IUserDb> | null> => {
    try {
      const user = await UserModel.findOne({
        $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      }).lean();

      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  },
};
