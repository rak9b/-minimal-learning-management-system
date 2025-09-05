import { Model } from "mongoose";

export type ICourse = {
  _id?: string;
  title: string;
  description: string;
  price: number;
  file: {
    url: string;
    key: string;
  };
};

export type CourseModel = Model<ICourse>;

export type ICourseFilters = {
  searchTerm?: string;
  title?: string;
};
