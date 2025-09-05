import { model, Schema } from "mongoose";
import {
  IUserProgress,
  UserProgressModel,
} from "../interface/progress.interface";

const userProgressSchema = new Schema<IUserProgress, UserProgressModel>(
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
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const UserProgress = model<IUserProgress, UserProgressModel>(
  "UserProgress",
  userProgressSchema
);
