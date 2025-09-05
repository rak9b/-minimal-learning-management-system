import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserProgressServices } from "../services/progress.services";

export const completeLecture = async (req: Request, res: Response) => {
  try {
    const user = (req as JwtPayload).user;
    const userId = user.id;
    const { courseId, lectureId } = req.body;

    const progress = await UserProgressServices.markLectureAsCompleted(
      userId,
      courseId,
      lectureId
    );

    res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const UserProgressController = {
  completeLecture,
};
