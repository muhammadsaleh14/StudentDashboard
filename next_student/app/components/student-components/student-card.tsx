"use client";

import { dateSchema, studentSchema } from "@/app/interfaces/schemas"; // Assuming the schemas are imported from a separate file
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedRow } from "@/app/provider/student-provider";
import { TrashIcon } from "@radix-ui/react-icons";

import { EditableField } from "@/app/components/student-components/EditableField";
import { CourseCombobox } from "@/app/components/student-components/CourseCombobox";
import { DateEditableField } from "./DateEditableField";
import { Course } from "@/app/interfaces/models";
import { useCourses } from "@/app/provider/courses-provider";
import { useEffect, useState } from "react";
import CustomAlertDialog from "../ui/CustomAlertDialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons"; //

interface StudentCardProps {
  courses: Course[];
}

export default function StudentCard({ courses }: StudentCardProps) {
  const { selectedRow, setSelectedRow, setIsCardOpen, isCardOpen } =
    useSelectedRow();
  const { setCourses } = useCourses();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for image file

  useEffect(() => {
    console.log("environment", process.env.NEXT_PUBLIC_API_URL);
    setCourses(courses);
  }, [courses, setCourses]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]); // Set selected image file
    }
  };
  const handleSaveImage = async () => {
    if (!imageFile || !selectedRow) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${selectedRow.id}/`,
        {
          method: "PATCH",
          body: formData, // Send FormData with the image
        }
      );

      if (response.ok) {
        const updatedStudent = await response.json();
        setSelectedRow({ ...selectedRow, image: updatedStudent.image });
        console.log("Image updated successfully!");
      } else {
        console.error("Failed to update image");
      }
    } catch (error: unknown) {
      console.error("Error updating image:", error);
    }
  };

  useEffect(() => {
    handleSaveImage();
  }, [imageFile]);

  const filteredCourses = courses.filter((course) => {
    if (selectedRow == null) {
      return []; // If selectedRow is null, return false to include all courses
    }
    return !selectedRow.courses.some(
      (enrolledCourse) => enrolledCourse.id === course.id
    );
  });

  const handleSaveDateOfBirth = async (newDate: Date) => {
    try {
      if (selectedRow == null) return;
      const adjustedDate = new Date(newDate);
      adjustedDate.setDate(adjustedDate.getDate() + 1);

      console.log(adjustedDate);

      // Format the adjusted date to "YYYY-MM-DD" (or any format expected by your backend)
      const formattedDate = adjustedDate.toISOString().split("T")[0];

      // Make an API call to update the student's date of birth
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${selectedRow.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date_of_birth: formattedDate }), // Update this field to match your API
        }
      );

      if (response.ok) {
        const updatedStudent = await response.json();
        // Update the context with the new Date of Birth
        setSelectedRow({
          ...selectedRow,
          date_of_birth: updatedStudent.date_of_birth,
        });

        console.log("Date of birth updated successfully!");
      } else {
        console.error("Failed to update date of birth");
      }
    } catch (error: unknown) {
      console.error("Error updating date of birth:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      throw new Error(`Failed to update date of birth: ${errorMessage}`);
    }
  };

  const handleRemoveCourseFromStudent = async (courseId: number) => {
    try {
      if (selectedRow == null) return; // Ensure selectedRow is not null

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/delete-by-student-and-course/`,
        {
          method: "DELETE", // Change method to DELETE
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: selectedRow.id, course: courseId }), // Send studentId and courseId
        }
      );

      if (response.ok) {
        // Remove the course from the selectedRow's courses
        const updatedCourses = selectedRow.courses.filter(
          (course) => course.id !== courseId
        );

        setSelectedRow({ ...selectedRow, courses: updatedCourses }); // Update the selected row with the new list of courses

        console.log("Student removed from course successfully!"); // Optional success message
      } else {
        console.error("Failed to remove student from course"); // Handle failed API call
      }
    } catch (error: unknown) {
      console.error("Error removing student from course:", error); // Handle errors

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred."; // Format error message

      throw new Error(`Failed to remove student from course: ${errorMessage}`); // Throw error for further handling if needed
    }
  };

  const handleAddCourseToStudent = async (courseId: number) => {
    try {
      if (selectedRow == null) return; // Ensure selectedRow is not null

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: selectedRow.id, course: courseId }), // Send studentId and courseId
        }
      );

      if (response.ok) {
        const newEnrollment = await response.json(); // Parse the response to get the enrollment info
        console.log("new Enrillment", newEnrollment);
        const enrolledCourseId = newEnrollment.course;

        const newCourseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${enrolledCourseId}`
        );
        const newCourse = await newCourseResponse.json();

        const updatedCourses = [...selectedRow.courses, newCourse]; // Add the new course to the existing courses

        setSelectedRow({ ...selectedRow, courses: updatedCourses }); // Update the selected row with the new list of courses

        console.log("Student enrolled in course successfully!"); // Optional success message
      } else {
        console.error("Failed to enroll student in course"); // Handle failed API call
      }
    } catch (error: unknown) {
      console.error("Error enrolling student in course:", error); // Handle errors

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred."; // Format error message

      throw new Error(`Failed to enroll student in course: ${errorMessage}`); // Throw error for further handling if needed
    }
  };

  const handleSaveCNIC = async (newCNIC: string) => {
    try {
      if (selectedRow == null) return;
      // Make an API call to update the student's CNIC
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/${selectedRow.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cnic: newCNIC }),
        }
      );
      if (response.ok) {
        const updatedStudent = await response.json();
        // Update the context with the new CNIC
        setSelectedRow({ ...selectedRow, cnic: updatedStudent.cnic });

        console.log("CNIC updated successfully!");
      } else {
        console.error("Failed to update CNIC");
      }
    } catch (error: unknown) {
      console.error("Error updating CNIC:", error);

      // Check if the error is an instance of Error
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      // Throw a new error with a more descriptive message
      throw new Error(`Failed to update CNIC: ${errorMessage}`);
    }
  };

  return (
    <div className="">
      <div className="p-1 w-auto border rounded-md mt-4 bg-gray-50">
        {/* <Button
          onClick={() => {
            setIsCardOpen(false);
            console.log("card is open : ", isCardOpen);
          }}
        >
          {" "}
          Close modal
        </Button> */}
        {selectedRow && (
          <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
            <DialogTitle hidden>Student Card</DialogTitle>
            <DialogContent className="max-h-[95.7143vh] sm:max-w-[525px] overflow-auto">
              <Card className="z-40">
                <CardHeader className="relative flex items-center p-0 pt-6">
                  <div className="flex flex-row">
                    <Avatar className="h-28 w-28 flex-grow">
                      <AvatarImage src={selectedRow.image ?? ""} />
                      <AvatarFallback>
                        {selectedRow.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Pencil button positioned in the top-right corner */}
                    <Button
                      className="rounded-full shadow  self-start p-2"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Pencil1Icon className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>

                  {/* Hidden file input for image */}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <CardTitle className="text-center">
                    {selectedRow.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="w-full pb-0">
                  <EditableField
                    label="CNIC"
                    value={selectedRow.cnic}
                    validator={studentSchema.shape.cnic}
                    onSave={(newCNIC) => handleSaveCNIC(newCNIC)}
                  />
                  <DateEditableField
                    label="Date of Birth"
                    value={selectedRow.date_of_birth}
                    validator={dateSchema}
                    onSave={(newDate) => handleSaveDateOfBirth(newDate)}
                  />
                </CardContent>

                <CardContent className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="mb-2">
                      <div className="text-center mb-2 font-semibold text-lg">
                        Enrolled Courses
                      </div>
                      <CourseCombobox
                        onAddCourse={handleAddCourseToStudent}
                        availableCourses={filteredCourses}
                      />
                    </div>
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-2 text-left">
                            Course
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Attendance(%)
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Grade
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRow.courses.length > 0 ? (
                          selectedRow.courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-100">
                              <td className="border border-gray-300 p-2">
                                {course.name}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {course.attendance_percentage ?? "N/A"}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {course?.grades?.grade || "N/A"}
                              </td>
                              <td className="border border-gray-300 p-2">
                                <Button
                                  size={"sm"}
                                  variant="destructive"
                                  onClick={() => {
                                    setCourseToRemove(course.id);
                                    setIsAlertDialogOpen(true);
                                  }}
                                >
                                  <TrashIcon />
                                </Button>
                                <CustomAlertDialog
                                  onSubmit={() => {
                                    if (courseToRemove !== null) {
                                      handleRemoveCourseFromStudent(
                                        courseToRemove
                                      );
                                    }
                                  }}
                                  open={isAlertDialogOpen}
                                  onOpenChange={setIsAlertDialogOpen}
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="border border-gray-300 p-2 text-center"
                            >
                              No courses available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
