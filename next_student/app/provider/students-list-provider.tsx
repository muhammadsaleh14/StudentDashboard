"use client"; // Required for client-side state management

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Student } from "../interfaces/models"; // Import your Student interface

// Define the context and types for the state and updater functions
interface StudentContextType {
  students: Student[]; // List of students
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>; // Function to update the list of students
  addStudent: (student: Student) => void; // Function to add a student
  removeStudent: (studentId: number) => void; // Function to remove a student by ID
  updateStudent: (updatedStudent: Student) => void; // Function to update a student's information
}

// Create the context
const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Create a context provider component
export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]); // State for the list of students

  // Function to add a student

  const addStudent = (student: Student) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  // Function to remove a student by ID
  const removeStudent = (studentId: number) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  };

  // Function to update a student's information
  const updateStudent = (updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        addStudent,
        removeStudent,
        updateStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use the student context in other components
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
