/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const lectureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLecture: builder.query({
      query: (arg: Record<string, any>) => ({
        method: "GET",
        url: "lecture",
        params: arg,
      }),

      providesTags: ["lecture"],
    }),
    getAllLectureByClassId: builder.query({
      query: (arg: Record<string, any>) => ({
        method: "GET",
        url: `lecture/module`,
        params: arg,
      }),

      providesTags: ["lecture"],
    }),
    getLectureById: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `lecture/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "course", id }],
    }),
    createLecture: builder.mutation({
      query: (newCourse) => ({
        url: "lecture",
        method: "POST",
        body: newCourse,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["lecture"],
    }),
    completeLecture: builder.mutation({
      query: (lectureData) => ({
        url: "lecture/complete",
        method: "POST",
        data: lectureData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["lecture"],
    }),
    updateLecture: builder.mutation({
      query: ({ id, ...updatedCourse }) => ({
        url: `lecture/${id}`,
        method: "PUT",
        body: updatedCourse,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),

      invalidatesTags: (result, error, { id }) => [{ type: "lecture", id }],
    }),
    deleteLecture: builder.mutation({
      query: (id) => ({
        url: `lecture/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "lecture", id }],
    }),
  }),
});

export const {
  useGetAllLectureQuery,
  useGetLectureByIdQuery,
  useCreateLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useGetAllLectureByClassIdQuery,
  useCompleteLectureMutation,
} = lectureApi;
