import { Types } from "mongoose";
import { UserProgress } from "../models/progress.model";
import { IUserProgress } from "../interface/progress.interface";

const markLectureAsCompleted = async (
  userId: string,
  courseId: string,
  lectureId: string
): Promise<IUserProgress> => {
  try {
    // Check if progress exists
    let userProgress = await UserProgress.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!userProgress) {
      // Create new progress record
      userProgress = new UserProgress({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        completedLectures: [],
      });
    }

    // Check if lecture is already completed
    const isAlreadyCompleted = userProgress.completedLectures.some(
      (lec) => lec.toString() === lectureId
    );

    if (!isAlreadyCompleted) {
      userProgress.completedLectures.push(lectureId as any);
    }

    await userProgress.save();
    return userProgress;
  } catch (error) {
    throw new Error("Error updating user progress: " + error);
  }
};

export const UserProgressServices = {
  markLectureAsCompleted,
};
