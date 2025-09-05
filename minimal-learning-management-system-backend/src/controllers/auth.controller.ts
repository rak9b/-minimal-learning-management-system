import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import catchAsync from "../shared/catchAsync";
import sendResponse from "../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const registerUser = catchAsync(async (req, res) => {
  const user = req.body;
  const newUser = await AuthService.registerUserIntoDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const user = req.body;
  const loggedInUser = await AuthService.loginUserFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: loggedInUser,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const user = (req as JwtPayload).user;
  const userId = user.id;
  const userProfile = await AuthService.authUserProfile(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: userProfile,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getUserProfile,
};
