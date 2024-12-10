"use client";

import { useSelectedRow } from "@/app/provider/student-provider"; // Import the context hook
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image"; // For displaying the image
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define the schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  cnic: z.string().min(13, { message: "CNIC must be 13 characters." }),
  date_of_birth: z.date(),
  department: z.object({
    name: z.string(),
  }),
  courses: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  image: z.instanceof(File).optional(),
});

export default function StudentPage() {
  const { selectedRow } = useSelectedRow(); // Get the selected student
  const [isEditMode, setIsEditMode] = useState(false); // Toggle edit/view mode
  const router = useRouter();

  useEffect(() => {
    if (!selectedRow) {
      // Redirect if no data is available
      router.push("/students"); // The path you want to redirect to
    }
  }, [selectedRow, router]);

  // Initialize the form with the selected student's data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedRow?.name || "",
      cnic: selectedRow?.cnic || "",
      date_of_birth: selectedRow?.date_of_birth
        ? new Date(selectedRow.date_of_birth)
        : undefined,
      department: {
        name: selectedRow?.department?.name || "",
      },
      courses: selectedRow?.courses || [],
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // Handle the form submission
  }

  return (
    <div className="bg-slate-500 rounded flex justify-center items-center w-full">
      <div className="bg-slate-50 w-1/2 p-5 m-5 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Student Information</h1>
          <div className="flex items-center">
            <span className="mr-2">Edit Mode</span>
            <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Image Display and Upload */}
            <div className="mb-4">
              <FormLabel>Student Image</FormLabel>
              {selectedRow?.image ? (
                <Image
                  src={selectedRow.image}
                  alt="Student image"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <p>No image available</p>
              )}
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          disabled={!isEditMode}
                          className="file-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter name"
                      disabled={!isEditMode} // Disable if not in edit mode
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CNIC Field */}
            <FormField
              control={form.control}
              name="cnic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNIC</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter CNIC"
                      disabled={!isEditMode} // Disable if not in edit mode
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth Field using DatePicker */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department Field */}
            <FormField
              control={form.control}
              name="department.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled // Always disabled as the department is static
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Courses List */}
            <div className="mb-4">
              <h2 className="font-semibold">Courses</h2>
              {selectedRow?.courses.map((course: any) => (
                <div key={course.id} className="mb-2">
                  <p>
                    <i>{course.name}</i>: {course.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {isEditMode && (
              <Button type="submit" disabled={!isEditMode}>
                Save Changes
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
