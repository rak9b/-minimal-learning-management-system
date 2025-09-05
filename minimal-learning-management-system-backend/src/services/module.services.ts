import { Request } from "express";
import ApiError from "../error/apiError";
import { ILecture } from "../interface/lecture.interface";
import { IModule, IModuleFilters } from "../interface/module.interface";
import { Module } from "../models/module.model";
import { Course } from "../models/course.model";
import { StatusCodes } from "http-status-codes";
import cloudinary, { uploadBufferToCloudinary } from "../config/cloudinary";
import mongoose, { SortOrder } from "mongoose";
import { Lecture } from "../models/lecture.model";
import { IPaginationOptions } from "../interface/paginaton";
import { paginationHelpers } from "../helpers/paginationHelper";
import { lectureSearchableFields } from "../constants/module";
import { IGenericResponse } from "../interface/common";

// const insertModuleAndLectureIntoDB = async (
//   req: Request,
//   module: IModule,
//   lecture: ILecture[]
// ) => {
//   try {
//     const course = await Course.findById(module.courseId);
//     if (!course) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         "Requested Course Does Not Found"
//       );
//     }

//     const fileUploadResult = req.files?.map(async (file) => {
//       const uploadFile = await cloudinary.uploader.upload(file.path, {
//         folder: "lms_uploads",
//         resource_type: "auto",
//       });
//       return uploadFile;
//     });
//     console.log(fileUploadResult);
//     const uploadModule = await Module.create(module);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const insertModuleAndLectureIntoDB = async (
//   req: Request,
//   module: IModule,
//   lectures: ILecture[]
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const course = await Course.findById(module.courseId).session(session);
//     if (!course) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         "Requested Course Does Not Found"
//       );
//     }
//     console.log(module);
//     console.log(req.files);
//     // Upload files to Cloudinary
//     const uploadedFiles = await Promise.all(
//       (req.files as Express.Multer.File[]).map(async (file) => {
//         const uploaded = await cloudinary.uploader.upload(file.path, {
//           folder: "lms_uploads",
//           resource_type: "auto",
//         });
//         return {
//           url: uploaded.secure_url,
//           key: uploaded.public_id,
//         };
//       })
//     );

//     // Find last moduleNumber for this course
//     const lastModule = await Module.findOne({ courseId: module.courseId })
//       .sort({ moduleNumber: -1 }) // Highest first
//       .select("moduleNumber")
//       .session(session);

//     const nextModuleNumber = lastModule ? lastModule.moduleNumber + 1 : 1;

//     // Create Module
//     const newModule = await Module.create(
//       [{ ...module, moduleNumber: nextModuleNumber }],
//       { session }
//     );
//     const moduleId = newModule[0]._id;

//     const lectureDocs = lectures.map((lec) => ({
//       ...lec,
//       moduleId,
//       courseId: module.courseId,
//       pdfNotes: uploadedFiles,
//     }));

//     await Lecture.insertMany(lectureDocs, { session });

//     await session.commitTransaction();
//     session.endSession();

//     return { module: newModule[0], lectures: lectureDocs };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const insertModuleAndLectureIntoDB = async (
  req: Request,
  module: IModule,
  lectures: ILecture[]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findById(module.courseId).session(session);
    if (!course) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Requested Course Does Not Found"
      );
    }

    // Upload files to Cloudinary using the helper
    const uploadedFiles = await Promise.all(
      (req.files as Express.Multer.File[]).map((file) =>
        uploadBufferToCloudinary(file.buffer, file.originalname, file.mimetype)
      )
    );

    // Rest of your code remains the same...
    const lastModule = await Module.findOne({ courseId: module.courseId })
      .sort({ moduleNumber: -1 })
      .select("moduleNumber")
      .session(session);

    const nextModuleNumber = lastModule ? lastModule.moduleNumber + 1 : 1;

    const newModule = await Module.create(
      [{ ...module, moduleNumber: nextModuleNumber }],
      { session }
    );
    const moduleId = newModule[0]._id;

    const lectureDocs = lectures.map((lec) => ({
      ...lec,
      moduleId,
      courseId: module.courseId,
      pdfNotes: uploadedFiles,
    }));

    await Lecture.insertMany(lectureDocs, { session });

    await session.commitTransaction();
    session.endSession();

    return { module: newModule[0], lectures: lectureDocs };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllModuleFromDB = async (
  filters: IModuleFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IModule[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: lectureSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Module.find(whereConditions)
    .populate("courseId", "title")
    .skip(skip)
    .limit(limit)
    .sort(sortConditions);
  const total = await Module.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getAllModuleByCourseId = async (courseId: string): Promise<IModule[]> => {
  const modules: IModule[] = await Module.find({ courseId });
  return modules;
};

const getModuleByIdFromDb = async (id: string): Promise<IModule | null> => {
  const modules: IModule | null = await Module.findById(id);
  if (!modules) {
    throw new ApiError(404, "Module not found");
  }
  return modules;
};

const deleteModuleFromDb = async (id: string): Promise<IModule | null> => {
  const modules: IModule | null = await Module.findByIdAndDelete(id);
  if (!Module) {
    throw new ApiError(404, "Module not found");
  }
  return modules;
};

const updateModuleByIdIntoDB = async (
  id: string,
  data: Partial<IModule>
): Promise<IModule> => {
  const result = await Module.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Module Does Not Found");
  }

  return result;
};
export const ModuleServices = {
  deleteModuleFromDb,
  getAllModuleFromDB,
  getAllModuleByCourseId,
  getModuleByIdFromDb,
  insertModuleAndLectureIntoDB,
  updateModuleByIdIntoDB,
};
