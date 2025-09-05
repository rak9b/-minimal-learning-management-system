import { Model, ObjectId } from "mongoose";
import { ICourse } from "./course.interface";

export type IModule = {
  _id?: string;
  courseId: ObjectId | ICourse;
  title: string;
  moduleNumber: number;
};

export type ModuleModel = Model<IModule>;

export type IModuleFilters = {
  searchTerm?: string;
  title?: string;
};
