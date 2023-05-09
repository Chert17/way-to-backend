import { Response } from 'express';

import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import { UserInputModel, UserViewModel } from '../models/users.models';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { userService } from '../service/user.service';
import { IWithPagination } from '../types/pagination.interface';
import {
  PaginationQueryParams,
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestQuery,
} from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const getAllUsersController = async (
  req: TypeRequestQuery<
    PaginationQueryParams & { searchLoginTerm: string; searchEmailTerm: string }
  >,
  res: Response<IWithPagination<UserViewModel>>
) => {
  const { searchEmailTerm, searchLoginTerm } = req.query;

  const pagination = paginationQueryParamsValidation(req.query);

  const users = await userQueryRepo.getAllUsers(
    searchLoginTerm,
    searchEmailTerm,
    pagination
  );

  return res.status(STATUS_CODE.OK).json(users);
};

export const createUserController = async (
  req: TypeRequestBody<UserInputModel>,
  res: Response<UserViewModel>
) => {
  const user = await userService.createUser(req.body);

  if (!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild create newUser

  return res.status(STATUS_CODE.CREATED).json(user);
};

export const deleteUserController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const userId = await userQueryRepo.getUserById(req.params.id);

  if (!userId) return res.sendStatus(STATUS_CODE.NOT_FOUND); //not found user

  const result = await userService.deleteUser(req.params.id);

  if (!result) return res.status(STATUS_CODE.BAD_REQUEST); // faild delete user

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};
