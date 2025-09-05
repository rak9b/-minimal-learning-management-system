import { model, Schema } from "mongoose";
import { ILecture, LectureModel } from "../interface/lecture.interface";

const lectureSchema = new Schema<ILecture, LectureModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    videoURl: {
      type: String,
      required: [true, "videoURl is required"],
      trim: true,
    },

    order: {
      type: Number,
      required: [false, "Order is required"],
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course Id is required"],
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module Id is required"],
    },
    pdfNotes: [
      {
        url: { type: String, required: true, trim: true },
        key: { type: String, required: true, trim: true },
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

export const Lecture = model<ILecture, LectureModel>("Lecture", lectureSchema);
