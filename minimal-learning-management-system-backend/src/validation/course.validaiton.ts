import z from "zod";

const insertCourseValidation = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

const updateCourseValidation = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

export const CourseValidation = {
  insertCourseValidation,
  updateCourseValidation,
};
