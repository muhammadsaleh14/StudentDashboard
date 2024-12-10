import { z } from "zod";

// Zod schema for student details
export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cnic: z.string().regex(/^[0-9]{13}$/, "Invalid CNIC format"),
  date_of_birth: z.string().refine((date) => {
    // Check if date format is correct (you can further refine this check)
    return !isNaN(Date.parse(date));
  }, "Invalid date"),
});

// Zod schema for courses
export const courseSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Course name is required"),
  attendance_percentage: z.number().min(0).max(100),
  grade: z.number().optional().nullable(),
});

export const dateSchema = z
  .date({
    required_error: "Date of birth is required.", // Custom error message
  })
  .refine(
    (date) => date <= new Date(), // Ensure date is not in the future
    { message: "Date cannot be in the future" }
  )
  .refine(
    (date) => date >= new Date("1900-01-01"), // Ensure date is not too far in the past
    { message: "Date cannot be before 1900" }
  );
