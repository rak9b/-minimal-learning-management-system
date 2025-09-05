import express from "express";
import { ModuleController } from "../controllers/module.controller";
import { FileUploadConfig } from "../utilis/multer";

const router = express.Router();
router.put("/:id", ModuleController.moduleUpdateById);

router.post(
  "/insert",
  FileUploadConfig.upload.array("files"),
  ModuleController.insertModuleAndLecture
);
router.get("/", ModuleController.getAllModules);
router.get("/:id/courses", ModuleController.getAllModulesByCourseId);
router.delete("/:id", ModuleController.deleteModule);
router.get("/:id", ModuleController.getModuleById);

export const ModuleRoute = router;
