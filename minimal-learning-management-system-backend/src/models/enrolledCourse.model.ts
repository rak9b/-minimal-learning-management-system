import { model, Schema } from "mongoose";
import {
  EnrolledCourseModel,
  IEnrolledCourse,
} from "../interface/enrolledCourse.interface";

const enrolledCourseSchema = new Schema<IEnrolledCourse, EnrolledCourseModel>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course Id is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "User Id is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const EnrolledCourse = model<IEnrolledCourse, EnrolledCourseModel>(
  "EnrolledCourse",
  enrolledCourseSchema
);
