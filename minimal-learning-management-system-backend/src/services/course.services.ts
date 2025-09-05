import { Request } from "express";
import { ICourse, ICourseFilters } from "../interface/course.interface";
import ApiError from "../error/apiError";
import cloudinary, { uploadToCloudinary } from "../config/cloudinary";
import { Course } from "../models/course.model";
import { IPaginationOptions } from "../interface/paginaton";
import { paginationHelpers } from "../helpers/paginationHelper";
import { courseSearchableFields } from "../constants/course";
import { SortOrder } from "mongoose";
import { IGenericResponse } from "../interface/common";
import { uploadToBlob } from "../utilis/multer";

const insertCourseInToDb = async (req: Request): Promise<ICourse> => {
  const fileData = req.file;
  const courseData = req.body as ICourse;
  if (!fileData) {
    throw new ApiError(201, "File is required");
  }

  // const uploadFile = await cloudinary.uploader.upload(fileData.path, {
  //   folder: "lms_uploads",
  //   resource_type: "auto",
  // });
  const uploadFile: any = await uploadToCloudinary(fileData);
  console.log(uploadFile);
  if (!uploadFile) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }

  const course: ICourse = {
    title: courseData?.title,
    description: courseData.description,
    price: courseData.price,
    file: {
      url: uploadFile.url as string,
      key: uploadFile.public_id as string,
    },
  };
  const newCourse = await Course.create(course);

  return newCourse;
};

const getAllCoursesFromDb = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICourse[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: courseSearchableFields.map((field) => ({
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

  const result = await Course.find(whereConditions)
    .skip(skip)
    .limit(limit)
    .sort(sortConditions);
  const total = await Course.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCourseByIdFromDb = async (id: string): Promise<ICourse | null> => {
  const course: ICourse | null = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

const deleteCourseFromDb = async (id: string): Promise<ICourse | null> => {
  const course: ICourse | null = await Course.findByIdAndDelete(id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

const updateCourseInDb = async (
  id: string,
  req: Request,
  courseData: Partial<ICourse>
): Promise<ICourse | null> => {
  const fileData = req.file;
  console.log("courseData", courseData);
  if (fileData) {
    // const uploadFile = await cloudinary.uploader.upload(fileData.path, {
    //   folder: "lms_uploads",
    //   resource_type: "auto",
    // });
    const uploadFile: any = await uploadToCloudinary(fileData);

    const updateCourse = {
      ...courseData,
      file: {
        url: uploadFile.url,
        key: uploadFile.public_id,
      },
    };
    courseData = updateCourse;
  }

  const updatedCourse: ICourse | null = await Course.findByIdAndUpdate(
    id,
    courseData,
    { new: true }
  );
  if (!updatedCourse) {
    throw new ApiError(404, "Course not found");
  }
  return updatedCourse;
};

export const CourseService = {
  insertCourseInToDb,
  getAllCoursesFromDb,
  getCourseByIdFromDb,
  deleteCourseFromDb,
  updateCourseInDb,
};
