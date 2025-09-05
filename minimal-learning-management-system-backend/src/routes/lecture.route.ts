import express from "express";
import { LectureController } from "../controllers/lecture.controller";
import { FileUploadConfig } from "../utilis/multer";
import Authentication from "../middlewares/auth";
import { USER_ROLE } from "../enum/user";
import { UserProgressController } from "../controllers/progress.controller";

const router = express.Router();
router.get("/:id/lecture", LectureController.getAllLecturesByModuleId);
router.get(
  "/module",
  Authentication(USER_ROLE.ADMIN, USER_ROLE.USER),
  LectureController.getCourseModulesWithLectures
);
router.post(
  "/complete",
  Authentication(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserProgressController.completeLecture
);
router.put(
  "/:id",
  FileUploadConfig.upload.array("files"),
  LectureController.updateLectureById
);
router.get("/", LectureController.getAllLectures);
router.delete("/:id", LectureController.deleteLecture);
router.get("/:id", LectureController.getLectureById);

export const LectureRoute = router;
