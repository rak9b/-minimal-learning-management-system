import { model, Schema } from "mongoose";
import { AuthModel, IAuthUser } from "../interface/auth.interface";
import { CourseModel, ICourse } from "../interface/course.interface";
import { IModule, ModuleModel } from "../interface/module.interface";

const moduleSchema = new Schema<IModule, ModuleModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    moduleNumber: {
      type: Number,
      required: [true, "moduleNumber is required"],
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Module Id is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Module = model<IModule, ModuleModel>("Module", moduleSchema);
