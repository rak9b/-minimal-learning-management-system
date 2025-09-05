import { StatusCodes } from "http-status-codes";
import { EnrolledCourseServices } from "../services/enrolledCourse.services";
import catchAsync from "../shared/catchAsync";
import sendResponse from "../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const enrolledIntoTheCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseServices.enrolledIntoTheCourse(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course enrolled successfully",
    data: result,
  });
});

const getMyAllCourse = catchAsync(async (req, res) => {
  const user = (req as JwtPayload).user;
  const userId = user.id;
  const result = await EnrolledCourseServices.getMyAllCourse(userId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course enrolled successfully",
    data: result,
  });
});

export const EnrolledCourseController = {
  getMyAllCourse,
  enrolledIntoTheCourse,
};
