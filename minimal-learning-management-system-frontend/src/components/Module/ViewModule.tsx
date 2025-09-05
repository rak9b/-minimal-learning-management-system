/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Lock,
  CheckCircle,
  PlayCircle,
  List,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
} from "lucide-react";
import {
  useCompleteLectureMutation,
  useGetAllLectureByClassIdQuery,
} from "@/redux/api/lectureApi";
import { Button } from "@mui/material";
import Loading from "@/helpers/Loading";

const extractYouTubeId = (url: string): string => {
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    return "";
  }
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

export default function ViewModule({ id }: { id: string }) {
  const router = useRouter();
  const query: Record<string, any> = {};
  if (id) {
    query["courseId"] = id;
  }
  const [completeLecture] = useCompleteLectureMutation();

  const { data: courseData, isLoading } = useGetAllLectureByClassIdQuery(query);

  const [modules, setModules] = useState<any[]>([]);

  const [currentLecture, setCurrentLecture] = useState({
    moduleIndex: 0,
    lectureIndex: 0,
  });

  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsedModules, setCollapsedModules] = useState<string[]>([]);

  useEffect(() => {
    if (courseData && courseData.length > 0) {
      console.log("Raw courseData from API:", courseData);

      // Process the data to ensure proper unlock states
      const processedModules = courseData.map(
        (module: { lectures: any[] }, moduleIndex: any) => ({
          ...module,
          lectures: module.lectures.map((lecture, lectureIndex) => ({
            ...lecture,
            isCompleted: lecture.isCompleted || false,
            isUnlocked: lecture.isUnlocked || false,
          })),
        })
      );

      // Create a flat array of all lectures with their positions
      const allLectures: any = [];
      processedModules.forEach(
        (module: { lectures: any[] }, moduleIndex: any) => {
          module.lectures.forEach((lecture, lectureIndex) => {
            allLectures.push({
              ...lecture,
              moduleIndex,
              lectureIndex,
              globalIndex: allLectures.length,
            });
          });
        }
      );

      // Process unlock states sequentially
      allLectures.forEach(
        (
          lecture: {
            moduleIndex: string | number;
            lectureIndex: string | number;
            isCompleted: any;
          },
          globalIndex: number
        ) => {
          if (globalIndex === 0) {
            // First lecture is always unlocked
            processedModules[lecture.moduleIndex].lectures[
              lecture.lectureIndex
            ].isUnlocked = true;
          } else {
            const prevLecture = allLectures[globalIndex - 1];
            // Unlock if the previous lecture is completed OR if already unlocked/completed
            const shouldUnlock = prevLecture.isCompleted || lecture.isCompleted;
            processedModules[lecture.moduleIndex].lectures[
              lecture.lectureIndex
            ].isUnlocked = shouldUnlock;
          }
        }
      );

      console.log("Processed modules:", processedModules);
      setModules(processedModules);
    }
  }, [courseData]);

  if (isLoading) return <Loading />;

  const getCurrentLecture = () => {
    return modules[currentLecture.moduleIndex]?.lectures[
      currentLecture.lectureIndex
    ];
  };

  const getAllLectures = () => {
    return modules.flatMap((module) => module.lectures);
  };

  const findLecturePosition = (lectureId: string) => {
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const lectureIndex = modules[moduleIndex].lectures.findIndex(
        (lecture: { _id: string }) => lecture._id === lectureId
      );
      if (lectureIndex !== -1) {
        return { moduleIndex, lectureIndex };
      }
    }
    return null;
  };

  // Helper function to get next lecture
  const getNextLecture = (
    moduleIndex: number,
    lectureIndex: number,
    modulesArray: any[]
  ) => {
    // Check if there's a next lecture in current module
    if (lectureIndex + 1 < modulesArray[moduleIndex].lectures.length) {
      return modulesArray[moduleIndex].lectures[lectureIndex + 1];
    }

    // Check if there's a next module
    if (
      moduleIndex + 1 < modulesArray.length &&
      modulesArray[moduleIndex + 1].lectures.length > 0
    ) {
      return modulesArray[moduleIndex + 1].lectures[0];
    }

    return null;
  };

  const currentLectureData = getCurrentLecture();

  const handleVideoComplete = async () => {
    try {
      // 1️⃣ Call backend to mark lecture as completed
      await completeLecture({
        courseId: currentLectureData.courseId,
        lectureId: currentLectureData._id,
      }).unwrap();

      // 2️⃣ Update the current lecture as completed
      const updatedModules = [...modules];
      updatedModules[currentLecture.moduleIndex].lectures[
        currentLecture.lectureIndex
      ].isCompleted = true;

      // 3️⃣ Find and unlock the next lecture
      const nextLecture = getNextLecture(
        currentLecture.moduleIndex,
        currentLecture.lectureIndex,
        updatedModules
      );
      if (nextLecture) {
        const nextPosition = findLecturePosition(nextLecture._id);
        if (nextPosition) {
          updatedModules[nextPosition.moduleIndex].lectures[
            nextPosition.lectureIndex
          ].isUnlocked = true;
        }
      }

      // 4️⃣ Save state
      setModules(updatedModules);

      console.log("Lecture completed and next unlocked:", updatedModules);
    } catch (error) {
      console.error("Failed to mark lecture complete:", error);
    }
  };

  const handleNextVideo = () => {
    const allLectures = getAllLectures();

    if (!allLectures?.length || !currentLectureData?._id) return;

    const currentGlobalIndex = allLectures.findIndex(
      (lecture) => lecture._id === currentLectureData._id
    );

    if (currentGlobalIndex === -1) return;

    // Find the next unlocked lecture
    let nextIndex = currentGlobalIndex + 1;
    while (
      nextIndex < allLectures.length &&
      !allLectures[nextIndex].isUnlocked
    ) {
      nextIndex++;
    }

    if (nextIndex < allLectures.length) {
      const nextLecture = allLectures[nextIndex];
      const nextPosition = findLecturePosition(nextLecture._id);

      if (nextPosition) {
        setCurrentLecture(nextPosition);
      }
    }
  };

  const handleLectureSelect = (moduleIndex: number, lectureIndex: number) => {
    const lecture = modules[moduleIndex].lectures[lectureIndex];
    console.log("Attempting to select lecture:", lecture);
    if (lecture.isUnlocked) {
      setCurrentLecture({ moduleIndex, lectureIndex });
    } else {
      console.log("Lecture is locked");
    }
  };

  const toggleModule = (moduleId: string) => {
    setCollapsedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalLectures = getAllLectures().length;
  const completedLectures = getAllLectures().filter(
    (lecture) => lecture.isCompleted
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Video Player Section */}
        <div
          className={`flex-1 ${
            showSidebar ? "lg:mr-80" : ""
          } transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2   bg-primary text-white rounded  cursor-pointer px-4 py-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Course
              </button>
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Lessons
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="p-4">
            <div className="aspect-video bg-black rounded-lg mb-6 relative overflow-hidden">
              {currentLectureData?.isUnlocked ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    currentLectureData.videoURl
                  )}?enablejsapi=1`}
                  title={currentLectureData.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <div className="text-center text-white">
                    <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Video Locked</h3>
                    <p className="text-gray-400">
                      Complete the previous video to unlock this lesson
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mb-6">
              <div className="text-sm text-primary font-medium mb-1">
                {modules[currentLecture.moduleIndex]?.title}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {currentLectureData?.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  Video Lesson
                </span>
                <span>
                  Lesson{" "}
                  {getAllLectures().findIndex(
                    (l) => l._id === currentLectureData?._id
                  ) + 1}{" "}
                  of {totalLectures}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {currentLectureData?.isUnlocked &&
                !currentLectureData?.isCompleted && (
                  <button
                    onClick={handleVideoComplete}
                    className=" hover:bg-primary/90 bg-primary text-white rounded  cursor-pointer"
                  >
                    Mark as Complete
                  </button>
                )}

              {currentLectureData?.isCompleted &&
                getAllLectures().findIndex(
                  (l) => l._id === currentLectureData?._id
                ) +
                  1 <
                  totalLectures && (
                  <button
                    onClick={handleNextVideo}
                    className="hover:bg-primary/90 flex items-center gap-2 bg-primary text-white rounded  cursor-pointer px-4 py-2"
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

              {currentLectureData?.isCompleted &&
                getAllLectures().findIndex(
                  (l) => l._id === currentLectureData?._id
                ) +
                  1 >=
                  totalLectures && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Course Complete!
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-card border-l border-border transform transition-transform duration-300 z-40 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Course Content
              </h2>
              <Button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {completedLectures} of {totalLectures} lessons completed
            </p>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {modules.map((module, moduleIndex) => (
              <div key={module._id} className="border-b border-border">
                {/* Module Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50 flex items-center justify-between"
                  onClick={() => toggleModule(module._id)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {
                        module.lectures.filter(
                          (l: { isCompleted: any }) => l.isCompleted
                        ).length
                      }{" "}
                      of {module.lectures.length} completed
                    </p>
                  </div>
                  {collapsedModules.includes(module._id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Module Lectures */}
                {!collapsedModules.includes(module._id) && (
                  <div className="bg-muted/20">
                    {module.lectures.map(
                      (lecture: any, lectureIndex: number) => (
                        <div
                          key={lecture._id}
                          className={`p-4 pl-8 border-b border-border/50 cursor-pointer transition-colors ${
                            moduleIndex === currentLecture.moduleIndex &&
                            lectureIndex === currentLecture.lectureIndex
                              ? "bg-primary/10 border-l-4 border-l-primary"
                              : "hover:bg-muted/50"
                          } ${
                            !lecture.isUnlocked
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            handleLectureSelect(moduleIndex, lectureIndex)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {lecture.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : lecture.isUnlocked ? (
                                <PlayCircle className="h-5 w-5 text-primary" />
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-medium text-sm mb-1 ${
                                  lecture.isUnlocked
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {lecture.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Video Lesson</span>
                                {lecture.pdfNotes &&
                                  lecture.pdfNotes.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {lecture.pdfNotes.length} PDF
                                        {lecture.pdfNotes.length > 1 ? "s" : ""}
                                      </span>
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </div>
  );
}
