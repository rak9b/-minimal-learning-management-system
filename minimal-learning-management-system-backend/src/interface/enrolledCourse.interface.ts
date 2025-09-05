import { Model, ObjectId } from "mongoose";
import { ICourse } from "./course.interface";
import { IAuthUser } from "./auth.interface";
import { ILecture } from "./lecture.interface";

export type IEnrolledCourse = {
  _id?: string;
  courseId: ObjectId | ICourse;
  userId: ObjectId | IAuthUser;
};

export type EnrolledCourseModel = Model<IEnrolledCourse>;
