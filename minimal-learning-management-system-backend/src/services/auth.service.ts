import { Secret } from "jsonwebtoken";
import config from "../config";
import ApiError from "../error/apiError";
import { hashHelper } from "../helpers/hashHelper";
import { jwtHelpers } from "../helpers/jwtHelper";
import { AuthUserWithToken, IAuthUser } from "../interface/auth.interface";
import { Auth } from "../models/auth.model";

const registerUserIntoDB = async (
  user: IAuthUser
): Promise<AuthUserWithToken> => {
  const isExitUser = await Auth.findOne({ email: user.email });
  if (isExitUser) {
    throw new ApiError(400, "User already exists with this email");
  }
  const hashPassword = await hashHelper.generateHash(user.password);
  const newUser = await Auth.create({
    ...user,
    password: hashPassword,
  });
  // generate a token for the new user
  const accessToken = jwtHelpers.createToken(
    {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    },
    config.jwt.secret_token as Secret,
    config.jwt.expire_in as string
  );

  return {
    user: newUser.toObject(),
    token: accessToken,
  };
};

const loginUserFromDB = async (
  user: Partial<IAuthUser>
): Promise<AuthUserWithToken> => {
  const { email, password } = user;
  const isExitUser = await Auth.findOne({ email });
  if (!isExitUser) {
    throw new ApiError(400, "User does not exist with this email");
  }
  const isPasswordMatched = hashHelper.compareHash(
    password as string,
    isExitUser.password
  );
  if (!isPasswordMatched) {
    throw new ApiError(400, "Password is incorrect");
  }
  // generate a token for the user
  const accessToken = jwtHelpers.createToken(
    {
      id: isExitUser._id,
      email: isExitUser.email,
      role: isExitUser.role,
    },
    config.jwt.secret_token as Secret,
    config.jwt.expire_in as string
  );

  return {
    user: isExitUser.toObject(),
    token: accessToken,
  };
};

const authUserProfile = async (userId: string): Promise<IAuthUser> => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const AuthService = {
  registerUserIntoDB,
  loginUserFromDB,
  authUserProfile,
};
