"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";
import { Course } from "@/app/interfaces/models"; // Assuming you have a Course type

interface CoursesContextType {
  courses: Course[] | null;
  setCourses: (courses: Course[]) => void;
}

export const CoursesContext = createContext<CoursesContextType | undefined>(
  undefined
);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[] | null>(null);

  // Function to fetch

  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);

  if (!context) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }

  return context;
};
