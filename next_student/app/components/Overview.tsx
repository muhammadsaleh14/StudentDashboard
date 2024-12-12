import AttendanceRateGraph from "@/app/components/AttendanceRateGraph";
import CoursePerformanceGraph from "@/app/components/CoursePerformanceGraph";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AverageAttendance, AverageGrade } from "@/app/interfaces/models";
import { PersonIcon, BackpackIcon } from "@radix-ui/react-icons";
import React from "react";

export default async function Overview() {
  const average_attendance = await fetchAverageAttendance();
  const average_grade = await fetchAverageGrade();
  const total_students = await fetchTotalStudents();
  const total_courses = await fetchTotalCourses();

  return (
    <div className="flex ">
      {/* Container A: Total Students and Courses on the left */}
      <div className="flex flex-col justify-center space-y-3 w-1/3 p-3">
        {/* Total Students */}
        <Card className="flex flex-row mb-2 h-24 items-center p-3 border border-border rounded-lg shadow-md ">
          <CardHeader className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Total Students
            </CardTitle>
            <PersonIcon height={40} width={40} />
          </CardHeader>
          <CardContent className="flex items-center justify-center grow text-center border-l border-border pl-2">
            <p className="text-xl font-bold ">{total_students}</p>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="flex flex-row h-24 items-center p-3 border border-border rounded-lg shadow-md ">
          <CardHeader className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Total Courses
            </CardTitle>
            <BackpackIcon height={40} width={40} />
          </CardHeader>
          <CardContent className="flex items-center justify-center grow text-center border-l border-border pl-2">
            <p className="text-xl font-bold ">{total_courses}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs on the right, horizontally side by side */}
      <div className="flex flex-col w-2/3 space-y-5 p-5">
        <div className="flex space-x-5">
          <AttendanceRateGraph data={average_attendance} />
          <CoursePerformanceGraph data={average_grade} />
        </div>
      </div>
    </div>
  );

  // Fetch average attendance data
  async function fetchAverageAttendance(): Promise<AverageAttendance[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/average-attendance/`
    );
    const data: AverageAttendance[] = await response.json();
    return data;
  }

  // Fetch average grade data
  async function fetchAverageGrade(): Promise<AverageGrade[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/average-grade/`
    );
    const data: AverageGrade[] = await response.json();
    return data;
  }

  interface total {
    count: number;
  }

  // Fetch total students data
  async function fetchTotalStudents(): Promise<number> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/total-students/`
    );
    const data: total = await response.json();
    return data.count;
  }

  // Fetch total courses data
  async function fetchTotalCourses(): Promise<number> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/total-courses/`
    );
    const data: total = await response.json();
    return data.count;
  }
}
