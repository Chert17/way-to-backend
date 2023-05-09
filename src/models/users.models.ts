export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserInputModel = {
  login: string;
  email: string;
  password: string;
};

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};
