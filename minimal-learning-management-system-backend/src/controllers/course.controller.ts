import { courseFilterableFields } from "../constants/course";
import { paginationFiled } from "../constants/pagination";
import { CourseService } from "../services/course.services";
import catchAsync from "../shared/catchAsync";
import pick from "../shared/pick";
import sendResponse from "../shared/sendResponse";

const insertCourse = catchAsync(async (req, res) => {
  const course = await CourseService.insertCourseInToDb(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const filters = pick(req.query, courseFilterableFields);
  const paginationOptions = pick(req.query, paginationFiled);
  const courses = await CourseService.getAllCoursesFromDb(
    filters,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses retrieved successfully",
    data: courses,
  });
});

const getCourseById = catchAsync(async (req, res) => {
  const course = await CourseService.getCourseByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course retrieved successfully",
    data: course,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const course = await CourseService.deleteCourseFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course deleted successfully",
    data: course,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const course = await CourseService.updateCourseInDb(
    req.params.id,
    req,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

export const CourseController = {
  insertCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
};
