import { ObjectId, WithId } from 'mongodb';

import { usersDbCollection } from '../../db/db.collections';
import { IUserDb } from '../../db/db.types';
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

    const users = await usersDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersDbCollection.countDocuments(find);

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

      const user = await usersDbCollection.findOne({ _id: new ObjectId(id) });

      if (!user) return null;

      return converterUser(user);
    } catch (error) {
      return null;
    }
  },

  getUserByEmail: async (email: string): Promise<UserViewModel | null> => {
    try {
      const user = await usersDbCollection.findOne({ email });

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
      const user = await usersDbCollection.findOne({
        $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      });

      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  },
};
