"use client";
import { useState } from "react";
import StudentCard from "@/app/components/student-components/student-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/app/interfaces/models";

const StudentModal = ({ students, courses }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <>
      {/* Student List with Clickable Cards */}
      {students.map((student) => (
        <div
          key={student.id}
          className="cursor-pointer"
          onClick={() => setSelectedStudent(student)}
        >
          <StudentCard courses={courses} student={student} />
        </div>
      ))}

      {/* Modal to display selected Student */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogTrigger asChild>
          <Button className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <StudentCard courses={courses} student={selectedStudent} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentModal;
