import { baseApi } from "./baseApi";

export const enrolledCourseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    enrolledCourse: build.mutation({
      query: (loginData) => ({
        url: "enrolled-course",
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["user", "enrolledCourse"],
    }),
    myCourses: build.query({
      query: () => ({
        url: "enrolled-course",
        method: "GET",
      }),
      // invalidatesTags: ["user", "admin", "enrolledCourse"],
      providesTags: ["user", "admin", "enrolledCourse"],
    }),
  }),
});

export const { useEnrolledCourseMutation, useMyCoursesQuery } =
  enrolledCourseApi;
