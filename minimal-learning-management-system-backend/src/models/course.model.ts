import { model, Schema } from "mongoose";
import { CourseModel, ICourse } from "../interface/course.interface";

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Number is required"],
    },
    file: {
      url: {
        type: String,
        required: [true, "File URL is required"],
      },
      key: {
        type: String,
        required: [true, "File key is required"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Course = model<ICourse, CourseModel>("Course", courseSchema);
