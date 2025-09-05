import { Types } from "mongoose";
import ApiError from "../error/apiError";
import { IEnrolledCourse } from "../interface/enrolledCourse.interface";
import { EnrolledCourse } from "../models/enrolledCourse.model";
import { UserProgress } from "../models/progress.model";
import { Course } from "../models/course.model";
import { Lecture } from "../models/lecture.model";
import { IUserProgress } from "../interface/progress.interface";
import { ICourse } from "../interface/course.interface";

const enrolledIntoTheCourse = async (
  payload: IEnrolledCourse
): Promise<IEnrolledCourse> => {
  const isAllReadyEnrolled = await EnrolledCourse.findOne({
    and: [{ courseId: payload.courseId }, { userId: payload.userId }],
  });
  if (isAllReadyEnrolled) {
    throw new ApiError(201, "Already enrolled the course");
  }
  const result = await EnrolledCourse.create(payload);
  return result;
};

// const getMyAllCourse = async (userId: string): Promise<IEnrolledCourse[]> => {
//   const result = await EnrolledCourse.find({ userId }).populate("courseId");
//   return result;
// };

type MyCourseWithProgress = {
  courseData: ICourse;
  totals: { lectures: number; completed: number };
  progressPercent: number; // 0–100
  isCourseCompleted: boolean;
};

export const getMyAllCourse = async (
  userId: string
): Promise<MyCourseWithProgress[]> => {
  const userObjId = new Types.ObjectId(userId);

  // 1) Find enrolled courses
  const enrollments = await EnrolledCourse.find({ userId: userObjId })
    .select("courseId")
    .lean();

  if (!enrollments.length) return [];

  const courseIds = enrollments.map(
    (e) => new Types.ObjectId(String(e.courseId))
  );

  // 2) Load all course docs
  const courses = await Course.find({ _id: { $in: courseIds } }).lean();

  // 3) Count total lectures per course (one DB round trip)
  const lectureCounts = await Lecture.aggregate<{
    _id: Types.ObjectId;
    total: number;
  }>([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: "$courseId", total: { $sum: 1 } } },
  ]);

  const totalByCourse = new Map<string, number>(
    lectureCounts.map((c) => [String(c._id), c.total])
  );

  // 4) Get user progress docs for these courses
  const progressDocs = await UserProgress.find({
    userId: userObjId,
    courseId: { $in: courseIds },
  })
    .select("courseId completedLectures")
    .lean<IUserProgress[]>();

  const completedByCourse = new Map<string, number>(
    progressDocs.map((p) => [
      String(p.courseId),
      // ensure uniqueness just in case
      new Set((p.completedLectures || []).map((id: any) => String(id))).size,
    ])
  );

  // 5) Merge and compute %
  const result: MyCourseWithProgress[] = courses.map((course) => {
    const key = String(course._id);
    const total = totalByCourse.get(key) ?? 0;
    const completed = completedByCourse.get(key) ?? 0;

    const progressPercent =
      total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      courseData: course,
      totals: { lectures: total, completed },
      progressPercent,
      isCourseCompleted: total > 0 && completed >= total,
    };
  });

  return result;
};

export const EnrolledCourseServices = {
  enrolledIntoTheCourse,
  getMyAllCourse,
};
