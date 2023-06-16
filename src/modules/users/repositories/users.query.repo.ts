import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { WithPagination } from '../../../types/pagination.interface';
import { SaQueryPagination } from '../../../utils/pagination/pagination';
import { UsersSqlTables } from '../../../utils/tables/users.sql.tables';
import { UserViewDto } from '../dto/user.view.dto';

const { USERS_TABLE, USERS_BAN_INFO_TABLE } = UsersSqlTables;

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAll(
    pagination: SaQueryPagination,
  ): Promise<WithPagination<UserViewDto>> {
    const {
      banStatus,
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
    } = pagination;

    const users = await this.dataSource.query(
      `
    select u.id, u.login, u.email, u.created_at as "createdAt",
    json_build_object('isBanned', coalesce(b.is_banned, false), 'banDate', b.ban_date, 'banReason', b.ban_reason) AS "banInfo"
    from ${USERS_TABLE} u
    left join ${USERS_BAN_INFO_TABLE} b on u.id = b.user_id 
    where u.email ilike $1 and u.login ilike $2 and
    case 
      when $3 = true then coalesce(b.is_banned, false) = true
      when $3 = false then coalesce(b.is_banned, false) = false
      else 1 = 1
    end  
    order by ${sortBy} ${sortDirection}
    limit ${pageSize} offset ${pagination.skip()}
    `,
      [`%${searchEmailTerm}%`, `%${searchLoginTerm}%`, banStatus],
    );

    const totalCount = await this.dataSource.query(
      `
    select count(*) from ${USERS_TABLE} u
    left join ${USERS_BAN_INFO_TABLE} b on u.id = b.user_id
    where u.email ilike $1 and u.login ilike $2 and
      case 
        when $3 = true then coalesce(b.is_banned, false) = true
        when $3 = false then coalesce(b.is_banned, false) = false
        else 1 = 1
      end
    `,
      [`%${searchEmailTerm}%`, `%${searchLoginTerm}%`, banStatus],
    );

    const pageCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: users,
    };
  }

  async getUserById(userId: string): Promise<UserViewDto> {
    const user = await this.dataSource.query(
      `SELECT id, login, email, created_at AS "createdAt"
      FROM ${USERS_TABLE} u
      WHERE u.id = '${userId}'`,
    );

    return {
      ...user[0],
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
  }
}
