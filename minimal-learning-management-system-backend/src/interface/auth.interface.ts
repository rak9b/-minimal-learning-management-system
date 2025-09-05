import { Model } from "mongoose";

export type IAuthUser = {
  _id: string;
  email: string;
  name: string;
  role: string;
  password: string;
};

export type AuthModel = Model<IAuthUser>;

export type AuthUserWithToken = {
  user: IAuthUser;
  token: string;
};
