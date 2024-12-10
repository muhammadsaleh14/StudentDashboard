// Department interface
export interface Department {
  id: number;
  name: string;
}

// Student interface
export interface Student {
  image: string | null;
  id: number;
  name: string;
  cnic: string;
  department: Department; // Foreign key to Department
  courses: Course[];
  date_of_birth: Date; // ISO date string
}

// Course interface
export interface Course {
  id: number;
  name: string;
  attendance_percentage: number | null;
  grades: Grade;
  description?: string; // description is optional
}

// Enrollment interface
export interface Enrollment {
  id: number;
  student: Student;
  course: Course;
}

// Attendance interface
export interface Attendance {
  id: number;
  student: Student;
  course: Course;
  date: string; // ISO date string
  status: boolean; // True for present, False for absent
}

// Grade interface
export interface Grade {
  id: number;
  student: Student;
  course: Course;
  grade: number;
}

export interface AverageAttendance {
  id: number; // Course ID
  name: string; // Course name
  average_attendance: number; // Average attendance in percentage (0-100)
}

export interface AverageGrade {
  id: number; // Course ID
  name: string; // Course name
  average_grade: number; // Average grade for the course
}
