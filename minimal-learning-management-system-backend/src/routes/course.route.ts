import express from "express";
import { FileUploadConfig } from "../utilis/multer";
import { CourseValidation } from "../validation/course.validaiton";
import { CourseController } from "../controllers/course.controller";
const router = express.Router();
router.put("/:id", FileUploadConfig.upload.single("file"), (req, res, next) => {
  const parsedData = JSON.parse(req.body.data);
  // const parsedData = req.body;
  req.body = CourseValidation.updateCourseValidation.parse(parsedData);

  return CourseController.updateCourse(req, res, next);
});
router.post("/", FileUploadConfig.upload.single("file"), (req, res, next) => {
  const parsedData = JSON.parse(req.body.data);
  // const parsedData = req.body;

  req.body = CourseValidation.insertCourseValidation.parse(parsedData);

  return CourseController.insertCourse(req, res, next);
});

router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourseById);
router.delete("/:id", CourseController.deleteCourse);

export const CourseRoute = router;
