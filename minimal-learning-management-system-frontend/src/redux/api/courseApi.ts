/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (arg: Record<string, any>) => ({
        method: "GET",
        url: "course",
        params: arg,
      }),

      // providesTags: ["course"],
    }),
    getCourseById: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `course/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "course", id }],
    }),
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "course",
        method: "POST",
        data: newCourse,

        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["course"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...updatedCourse }) => ({
        url: `course/${id}`,
        method: "PUT",
        body: updatedCourse,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),

      invalidatesTags: (result, error, { id }) => [{ type: "course", id }],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "course", id }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
