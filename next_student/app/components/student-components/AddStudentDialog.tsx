"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DatePickerDemo } from "@/app/components/ui/DatePickerDemo"; // Importing your DatePicker
import { Department, Student } from "@/app/interfaces/models";
import { DepartmentCombobox } from "./DepartmentCombobox";

interface AddStudentDialogInterface {
  setStudentAdded: (student: Student) => void;
}
export function AddStudentDialog({
  setStudentAdded,
}: AddStudentDialogInterface) {
  // State management for form inputs
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [department, setDepartment] = useState<Department | null>();
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!department) {
        return;
      }
      // Create FormData instance
      const formData = new FormData();

      // const student = new Student();
      // Append form fields
      formData.append("name", name);
      formData.append("cnic", cnic);
      formData.append("department", department.id.toString()); // Ensure department is the ID or correct format
      formData.append(
        "date_of_birth",
        dateOfBirth?.toISOString().split("T")[0] || "" // Format date to 'YYYY-MM-DD'
      );

      // Conditionally append the image file if available
      if (imageUrl) {
        const imageFile = await fetch(imageUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], "uploaded-image.jpg", { type: blob.type })
          );
        formData.append("image", imageFile);
      }

      console.log("Data being sent to the backend:", formData);

      // Send POST request to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Response Error:", await response.json());
        throw new Error("Failed to save student. Please check the input.");
      }

      const newStudent = await response.json();

      // Log the new student for debugging
      console.log("Student saved successfully:", newStudent);

      // Reset form fields after successful submission
      setName("");
      setCnic("");
      setDepartment(null);
      setDateOfBirth(undefined);
      setImageUrl(null);

      // Optionally: Update the UI (e.g., refresh student list, close dialog, show a success message)
      alert("Student added successfully!");
      setStudentAdded(newStudent);
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student. Please try again.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/departments/`
      );
      const data = await response.json(); // Correct invocation of .json()
      console.log(data);
      setDepartments(data); // Set the fetched data to state
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-10" variant="outline">
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adding Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Student Image Avatar with Upload */}
          <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt="Student Image" />
              ) : (
                <AvatarFallback>ST</AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex justify-center">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* CNIC Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cnic" className="text-right">
              CNIC
            </Label>
            <Input
              id="cnic"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="col-span-3"
              maxLength={15}
            />
          </div>

          {/* Date of Birth DatePicker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Date of Birth
            </Label>
            <div className="col-span-3">
              <DatePickerDemo onDateChange={setDateOfBirth} />
            </div>
          </div>

          {/* Department Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <DepartmentCombobox
              availableDepartments={departments}
              setDepartment={setDepartment}
            />
            {/* <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="col-span-3"
            /> */}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
