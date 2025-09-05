import { Model, ObjectId } from "mongoose";
import { ICourse } from "./course.interface";
import { IAuthUser } from "./auth.interface";
import { ILecture } from "./lecture.interface";

export type IUserProgress = {
  _id?: string;
  courseId: ObjectId | ICourse;
  userId: ObjectId | IAuthUser;
  completedLectures: [ObjectId | ILecture];
};

export type UserProgressModel = Model<IUserProgress>;
