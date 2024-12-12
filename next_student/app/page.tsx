import StudentCard from "@/app/components/student-components/student-card";
import StudentsList from "@/app/components/student-components/StudentsList";
import { Course, Student } from "@/app/interfaces/models";

import { AddStudentDialog } from "@/app/components/student-components/AddStudentDialog";

import Overview from "@/app/components/Overview";
import { env } from "process";
const Dashboard = async () => {
  console.log("next API_URL:", process.env.NEXT_PUBLIC_API_URL);
  const students: Student[] = await fetchStudents();
  const courses: Course[] = await fetchCourses();
  return (
    <div className="mb-10">
      <h1 className="m-10 text-center text-4xl font-bold  shadow-md">
        Dashboard
      </h1>
      <Overview />

      <div className="">
        <h1 className="m-5 text-3xl text-center font-semibold">Students</h1>

        <div className="flex flex-row justify-around ">
          <StudentCard courses={courses} />
          <StudentsList studentsProp={students} />
        </div>
      </div>
    </div>
  );
};

async function fetchStudents(): Promise<Student[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students/`
  );
  return response.json();
}
async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/`
  );
  return response.json();
}

export default Dashboard;
