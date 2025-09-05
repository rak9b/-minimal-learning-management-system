import express from "express";
import { EnrolledCourseController } from "../controllers/enrolledCourse.controller";
import Authentication from "../middlewares/auth";
import { USER_ROLE } from "../enum/user";

const router = express.Router();

router.post("/", EnrolledCourseController.enrolledIntoTheCourse);
router.get(
  "/",
  Authentication(USER_ROLE.USER),
  EnrolledCourseController.getMyAllCourse
);

export const EnrolledCourseRoute = router;
