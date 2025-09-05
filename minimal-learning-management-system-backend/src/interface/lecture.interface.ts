import { Model, ObjectId } from "mongoose";
import { ICourse } from "./course.interface";
import { IModule } from "./module.interface";

export type ILecture = {
  _id?: string;
  courseId: ObjectId | ICourse;
  moduleId: ObjectId | IModule;
  title: string;
  order?: number;
  videoURl: string;
  pdfNotes: IPDFNotes[];
};

type IPDFNotes = {
  url: string;
  key: string;
};

export type LectureModel = Model<ILecture>;
