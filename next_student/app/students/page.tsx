import StudentCard from "@/app/components/student-components/student-card";
import StudentsList from "@/app/components/student-components/StudentsList";
import { Course, Student } from "@/app/interfaces/models";

import { AddStudentDialog } from "../components/student-components/AddStudentDialog";

const Students = async () => {
  const students: Student[] = await fetchStudents();
  const courses: Course[] = await fetchCourses();
  return (
    <div>
      <h1 className="m-5 text-3xl text-center font-semibold">Students</h1>

      <div className="flex flex-row justify-around">
        <div className="flex flex-col">
          <AddStudentDialog />
          <StudentCard courses={courses} />
        </div>
        <StudentsList studentsProp={students} />
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

export default Students;
