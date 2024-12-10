"use client";

import { useState } from "react";
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

export function AddStudentDialog() {
  // State management for form inputs
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Log all values to the console on submit
    console.log({
      name,
      cnic,
      department,
      dateOfBirth,
      imageUrl,
    });
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
              <DatePickerDemo
                selectedDate={dateOfBirth}
                onDateChange={setDateOfBirth}
              />
            </div>
          </div>

          {/* Department Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="col-span-3"
            />
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
