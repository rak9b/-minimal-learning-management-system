import mongoose from "mongoose";
import ApiError from "../error/apiError";
import { ILecture } from "../interface/lecture.interface";
import { Lecture } from "../models/lecture.model";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import cloudinary, { uploadToCloudinary } from "../config/cloudinary";
import { Module } from "../models/module.model";
import { UserProgress } from "../models/progress.model";

const updateLectureIntoDB = async (
  req: Request,
  lectureId: string,
  lectureData: Partial<ILecture>
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLecture = await Lecture.findById(lectureId).session(session);
    if (!existingLecture) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Lecture not found");
    }

    // Upload new files if provided
    let uploadedFiles: any = [];
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      uploadedFiles = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file: any) => {
          // const uploaded = await cloudinary.uploader.upload(file.path, {
          //   folder: "lms_uploads",
          //   resource_type: "auto",
          // });
          const uploaded: any = await uploadToCloudinary(file.path as any);
          return {
            url: uploaded.url,
            key: uploaded.public_id,
          };
        })
      );
    }

    // Update fields if provided
    if (lectureData.title) existingLecture.title = lectureData.title;
    if (lectureData.order !== undefined)
      existingLecture.order = lectureData.order;
    if (lectureData.videoURl) existingLecture.videoURl = lectureData.videoURl;

    // Append new PDF notes if uploaded
    if (uploadedFiles.length > 0) {
      existingLecture.pdfNotes.push(...uploadedFiles);
    }

    await existingLecture.save({ session });

    await session.commitTransaction();
    session.endSession();

    return existingLecture;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllLectures = async (filters: {
  courseId?: string;
  moduleId?: string;
  search?: string;
}) => {
  const { courseId, moduleId, search } = filters;

  let moduleIds: string[] = [];

  if (moduleId) {
    moduleIds = [moduleId];
  } else if (courseId) {
    const modules = await Module.find({ courseId }).select("_id");
    if (!modules.length) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No modules found for this course"
      );
    }
    moduleIds = modules.map((m) => m._id.toString());
  }

  // lecture query
  const query: any = {};
  if (moduleIds.length > 0) query.moduleId = { $in: moduleIds };
  if (search) query.title = { $regex: search, $options: "i" };

  const lectures = await Lecture.find(query)
    .sort({ createdAt: -1 })
    .populate("moduleId", "title moduleNumber")
    .populate("courseId", "title")
    .exec();

  return lectures;
};

const getAllLectureFromDB = async (): Promise<ILecture[]> => {
  const lecture: ILecture[] = await Lecture.find({});
  return lecture;
};

const getAllLectureByModuleId = async (
  moduleId: string
): Promise<ILecture[]> => {
  const lecture: ILecture[] = await Lecture.find({ moduleId });
  return lecture;
};

const getLectureByIdFromDb = async (id: string): Promise<ILecture | null> => {
  const lecture: ILecture | null = await Lecture.findById(id);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }
  return lecture;
};

const deleteLectureFromDb = async (id: string): Promise<ILecture | null> => {
  const lecture: ILecture | null = await Lecture.findByIdAndDelete(id);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }
  return lecture;
};

// const getModulesWithLectures = async (filters: {
//   courseId?: string;
//   moduleId?: string;
//   search?: string;
// }) => {
//   const { courseId, moduleId, search } = filters;

//   let moduleQuery: any = {};
//   if (moduleId) {
//     moduleQuery._id = moduleId;
//   } else if (courseId) {
//     moduleQuery.courseId = courseId;
//   }

//   // 1️⃣ Find all modules (optionally filtered)
//   const modules = await Module.find(moduleQuery)
//     .sort({ moduleNumber: 1 })
//     .lean();

//   if (!modules.length) {
//     throw new ApiError(StatusCodes.NOT_FOUND, "No modules found");
//   }

//   // 2️⃣ For each module, fetch its lectures
//   const moduleWithLectures = await Promise.all(
//     modules.map(async (mod) => {
//       const lectureQuery: any = { moduleId: mod._id };
//       if (search) lectureQuery.title = { $regex: search, $options: "i" };

//       const lectures = await Lecture.find(lectureQuery)
//         .sort({ createdAt: -1 })
//         .lean();

//       return {
//         ...mod,
//         lectures,
//       };
//     })
//   );

//   return moduleWithLectures;
// };

const getModulesWithLecturesAndProgress = async (filters: {
  courseId: string;
  moduleId?: string;
  search?: string;
  userId: string;
}) => {
  const { courseId, moduleId, search, userId } = filters;

  // 1️⃣ Fetch modules
  const moduleQuery: any = {};
  if (moduleId) {
    moduleQuery._id = moduleId;
  } else if (courseId) {
    moduleQuery.courseId = courseId;
  }

  const modules = await Module.find(moduleQuery)
    .sort({ moduleNumber: 1 })
    .lean();

  if (!modules.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No modules found");
  }

  // 2️⃣ Get user progress
  const userProgress = await UserProgress.findOne({ courseId, userId }).lean();
  const completedLectureIds =
    userProgress?.completedLectures?.map((id) => id.toString()) || [];

  // 3️⃣ Attach lectures with progress
  const moduleWithLectures = await Promise.all(
    modules.map(async (mod) => {
      const lectureQuery: any = { moduleId: mod._id };
      if (search) lectureQuery.title = { $regex: search, $options: "i" };

      const lectures = await Lecture.find(lectureQuery)
        .sort({ createdAt: 1 }) // ascending, so first one is index 0
        .lean();

      // decorate lectures with progress
      const lecturesWithProgress = lectures.map((lec, idx) => {
        return {
          ...lec,
          isCompleted: completedLectureIds.includes(lec._id.toString()),
          isUnlocked: idx === 0, // only first lecture is unlocked
        };
      });

      return {
        ...mod,
        lectures: lecturesWithProgress,
      };
    })
  );

  return moduleWithLectures;
};

export const LectureServices = {
  deleteLectureFromDb,
  getAllLectureFromDB,
  getAllLectureByModuleId,
  getLectureByIdFromDb,
  updateLectureIntoDB,
  getAllLectures,
  // getModulesWithLectures,
  getModulesWithLecturesAndProgress,
};
