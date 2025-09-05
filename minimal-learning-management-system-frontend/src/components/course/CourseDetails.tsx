/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import {
  Star,
  Clock,
  BookOpen,
  ArrowLeft,
  Globe,
  PlayCircle,
} from "lucide-react";
import { Button } from "@mui/material";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import Image from "next/image";
import Loading from "@/helpers/Loading";
import { useEnrolledCourseMutation } from "@/redux/api/enrolledCourseApi";
import { useAppSelector } from "@/redux/hooks";
import { getUserInfo } from "@/utils/auth";
import Swal from "sweetalert2";

const course = {
  id: "1",
  title: "Complete Web Development Bootcamp",
  instructor: "Sarah Johnson",
  instructorImage:
    "https://media.geeksforgeeks.org/wp-content/uploads/20230629123647/Best-C-Programming-Courses-For-Beginners.png",
  instructorBio:
    "Senior Full Stack Developer with 8+ years of experience at top tech companies. Passionate about teaching and helping students launch their careers in web development.",
  instructorExperience: "8+ years",
  instructorStudents: "45,000+",
  rating: 4.8,
  reviewCount: 12543,
  price: 89,
  originalPrice: 199,
  description:
    "Learn modern web development from scratch. Build real projects with HTML, CSS, JavaScript, React, and Node.js.",
  category: "Web Development",
  duration: "42 hours",
  lessons: 156,
  level: "Beginner to Advanced",
  language: "English",
  lastUpdated: "December 2024",
  whatYouLearn: [
    "Build responsive websites with HTML5 and CSS3",
    "Master JavaScript ES6+ and modern frameworks",
    "Create dynamic web applications with React",
    "Develop backend APIs with Node.js and Express",
    "Work with databases and authentication",
    "Deploy applications to production",
  ],
  requirements: [
    "No prior programming experience required",
    "A computer with internet connection",
    "Willingness to learn and practice",
  ],
};

const CourseDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const [enrolledCourse] = useEnrolledCourseMutation();
  // const user = useAppSelector((state) => state.user.user);
  const user: any = getUserInfo();

  const { data, isLoading } = useGetCourseByIdQuery(id);
  const userData = useAppSelector((state) => state.user.user);
  if (isLoading) return <Loading />;
  const enrolledCourseHandler = async () => {
    try {
      const payload = {
        userId: user?.id,
        courseId: id,
      };
      const result = await enrolledCourse(payload);
      console.log(result);
      if (result.data) {
        Swal.fire({
          title: "Success",
          text: "Course Enrolled Successfully",
          icon: "success",
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err?.data,
        icon: "error",
      });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.category}
                </span>
                <span className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {data?.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {data?.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-muted-foreground">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <PlayCircle className="h-5 w-5" />
                  <span>{course.lessons} lessons</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span>{course.language}</span>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className=" ">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Instructor
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <Image
                  height={64}
                  width={64}
                  src={course.instructorImage || "/placeholder.svg"}
                  alt={course.instructor}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-foreground">
                    {course.instructor}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Course Instructor
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-4">
                {course.instructorBio}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8 mt-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What youll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Course Preview Card */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="relative mb-4">
                  <Image
                    height={192}
                    width={384}
                    src={data?.file?.url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    ${data?.price}
                  </span>
                  {course.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    disabled={!userData?.role}
                    onClick={() => enrolledCourseHandler()}
                    className={`w-full   py-2 rounded text-white    cursor-pointer ${
                      userData?.role
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-red-200"
                    }`}
                  >
                    Enroll Now
                  </button>
                  {!userData?.role && (
                    <span className="text-red-500">
                      If you enroll the course. Please login first
                    </span>
                  )}
                </div>

                {/* Course Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons:</span>
                    <span className="font-medium">{course.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{course.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Instructor Info
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Instructor
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={course.instructorImage || "/placeholder.svg"}
                    alt={course.instructor}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-foreground">
                      {course.instructor}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Course Instructor
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-4">
                  {course.instructorBio}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-bold text-foreground">
                      {course.instructorExperience}
                    </div>
                    <div className="text-muted-foreground">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-bold text-foreground">
                      {course.instructorStudents}
                    </div>
                    <div className="text-muted-foreground">Students</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
