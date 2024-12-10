"use client";

import { columns } from "@/app/components/student-components/table/columns";
import { Student } from "@/app/interfaces/models";

import { DataTable } from "@/app/components/student-components/table/data-table";
import { useStudents } from "@/app/provider/students-list-provider";
import { useEffect } from "react";

interface StudentsListProps {
  studentsProp: Student[]; // Define the student prop type
}

export default function StudentsList({ studentsProp }: StudentsListProps) {
  const { students, setStudents } = useStudents();
  useEffect(() => {
    setStudents(studentsProp);
  }, [studentsProp, setStudents]);

  return (
    <div className="m-2 flex-nowrap w-full">
      <DataTable columns={columns} data={students} />
    </div>
  );
}
