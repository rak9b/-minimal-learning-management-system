import { lectureFilterableFields } from "../constants/module";
import { paginationFiled } from "../constants/pagination";
import { ModuleServices } from "../services/module.services";
import catchAsync from "../shared/catchAsync";
import pick from "../shared/pick";
import sendResponse from "../shared/sendResponse";

const insertModuleAndLecture = catchAsync(async (req, res) => {
  const moduleData = JSON.parse(req.body.module);

  const lectureData = Array.isArray(req.body.lectures)
    ? req.body.lectures.map((lecture: string) => JSON.parse(lecture))
    : [JSON.parse(req.body.lectures)];

  const result = await ModuleServices.insertModuleAndLectureIntoDB(
    req,
    moduleData,
    lectureData
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module and Lectures created successfully",
    data: result,
  });
});

const getAllModules = catchAsync(async (req, res) => {
  const filters = pick(req.query, lectureFilterableFields);
  const paginationOptions = pick(req.query, paginationFiled);
  const module = await ModuleServices.getAllModuleFromDB(
    filters,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Modules retrieved successfully",
    data: module,
  });
});

const getAllModulesByCourseId = catchAsync(async (req, res) => {
  const module = await ModuleServices.getAllModuleByCourseId(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Modules retrieved successfully",
    data: module,
  });
});

const getModuleById = catchAsync(async (req, res) => {
  const module = await ModuleServices.getModuleByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module retrieved successfully",
    data: module,
  });
});

const deleteModule = catchAsync(async (req, res) => {
  const module = await ModuleServices.deleteModuleFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module deleted successfully",
    data: module,
  });
});

const moduleUpdateById = catchAsync(async (req, res) => {
  const module = await ModuleServices.updateModuleByIdIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module Update  successfully",
    data: module,
  });
});
export const ModuleController = {
  getAllModules,
  getModuleById,
  deleteModule,
  getAllModulesByCourseId,
  insertModuleAndLecture,
  moduleUpdateById,
};
