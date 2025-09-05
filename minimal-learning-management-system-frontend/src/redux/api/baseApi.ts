import { axiosBaseQuery } from "@/axios/axiosBaseQuery";
import { URL } from "@/constants/url";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: URL }),
  endpoints: (builder) => ({}),
  tagTypes: [
    "user",
    "course",
    "lecture",
    "module",
    "user",
    "admin",
    "enrolledCourse",
  ],
});
