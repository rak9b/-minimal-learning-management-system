/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loading from "@/helpers/Loading";
import { useMyCoursesQuery } from "@/redux/api/enrolledCourseApi";
import { getUserInfo } from "@/utils/auth";
import { Play, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EnrolledCourses = () => {
  const { data: courses, isLoading } = useMyCoursesQuery({});
  if (isLoading) return <Loading />;

  console.log("courses", courses);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          My Enrolled Courses
        </h2>
        <span className="text-sm text-muted-foreground">
          {courses?.length} courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses?.map((course: any) => (
          <div
            key={course.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex">
              {/* Course Thumbnail */}
              <div className="w-44 h-full flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Image
                  height={50}
                  width={20}
                  src={course?.courseData?.file?.url || "/placeholder.svg"}
                  alt={course?.courseData?.title}
                  className="w-full h-full "
                />
              </div>

              {/* Course Content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground text-sm leading-tight mb-1">
                    {course.courseData.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Mohammad Mamun (dammy text)
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-card-foreground">
                      {course?.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course?.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/view-module/${course?.courseId?._id}`}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    {course.isCompleted ? (
                      <>
                        <Play className="w-3 h-3" />
                        Continue
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Start
                      </>
                    )}
                  </Link>
                  <button className="flex-1 bg-transparent border border-border hover:bg-accent text-card-foreground text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Outline
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
