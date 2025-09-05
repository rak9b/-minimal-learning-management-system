import { StatusCodes } from "http-status-codes";
import { LectureServices } from "../services/lecture.services";
import catchAsync from "../shared/catchAsync";
import sendResponse from "../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const updateLectureById = catchAsync(async (req, res, next) => {
  try {
    const lectureId = req.params.id;
    const lectureData = JSON.parse(req.body.lecture);

    const updatedLecture = await LectureServices.updateLectureIntoDB(
      req,
      lectureId,
      lectureData
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Lecture updated successfully",
      data: updatedLecture,
    });
  } catch (error) {
    next(error);
  }
});

const getAllLectures = catchAsync(async (req, res) => {
  const filters = {
    courseId: req.query.courseId as string | undefined,
    moduleId: req.query.moduleId as string | undefined,
    search: req.query.searchTerm as string | undefined,
  };
  const lecture = await LectureServices.getAllLectures(filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lectures retrieved successfully",
    data: lecture,
  });
});

const getAllLecturesByModuleId = catchAsync(async (req, res) => {
  const lecture = await LectureServices.getAllLectureByModuleId(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lectures retrieved successfully",
    data: lecture,
  });
});

const getLectureById = catchAsync(async (req, res) => {
  const lecture = await LectureServices.getLectureByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lecture retrieved successfully",
    data: lecture,
  });
});

const deleteLecture = catchAsync(async (req, res) => {
  const lecture = await LectureServices.deleteLectureFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lecture deleted successfully",
    data: lecture,
  });
});

const getCourseModulesWithLectures = catchAsync(async (req, res) => {
  const user = (req as JwtPayload).user;
  const userId = user.id;
  const { courseId, moduleId, search } = req.query;

  const result = await LectureServices.getModulesWithLecturesAndProgress({
    courseId: courseId as string,
    moduleId: moduleId as string,
    search: search as string,
    userId: userId as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Modules with lectures retrieved successfully",
    data: result,
  });
});

export const LectureController = {
  getAllLectures,
  getLectureById,
  deleteLecture,
  getAllLecturesByModuleId,
  updateLectureById,
  getCourseModulesWithLectures,
};
