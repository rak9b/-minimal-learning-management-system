/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const moduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllModule: builder.query({
      query: (arg: Record<string, any>) => ({
        method: "GET",
        url: "module",
        params: arg,
      }),

      providesTags: ["module"],
    }),
    getModuleById: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `module/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "course", id }],
    }),
    createModule: builder.mutation({
      query: (newCourse) => ({
        url: "module",
        method: "POST",
        body: newCourse,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["module"],
    }),
    updateModule: builder.mutation<any, { id: string; payload: Partial<any> }>({
      query: ({ id, payload }) => ({
        url: `module/${id}`,
        method: "PUT",
        body: payload,
      }),

      invalidatesTags: (result, error, { id }) => [{ type: "module", id }],
    }),
    deleteModule: builder.mutation({
      query: (id) => ({
        url: `module/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "module", id }],
    }),
  }),
});

export const {
  useGetAllModuleQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;
