import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/interfaces/models";

interface CourseComboboxProps {
  onAddCourse: (courseId: number) => Promise<void>; // Prop to handle adding the course
  availableCourses: Course[]; // Prop to pass the available courses
}

export const CourseCombobox = ({
  onAddCourse,
  availableCourses,
}: CourseComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Change to Course type

  const handleAddCourse = () => {
    if (selectedCourse) {
      onAddCourse(selectedCourse.id); // Pass the selected course object
      setSelectedCourse(null); // Reset selection after adding
      setOpen(false); // Close dropdown
    }
  };

  return (
    <div className="flex">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedCourse
              ? selectedCourse.name // Use course name for the button label
              : "Select a course..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search course..." className="h-9" />
            <CommandList>
              <CommandEmpty>No course found.</CommandEmpty>
              <CommandGroup>
                {availableCourses.map((course) => (
                  <CommandItem
                    key={course.id} // Assuming 'id' is a unique identifier
                    onSelect={() => {
                      setSelectedCourse(course);
                      setOpen(false); // Set the selected course object
                    }}
                  >
                    {course.name} {/* Display course name */}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button onClick={handleAddCourse} className="ml-2">
        Add Course
      </Button>
    </div>
  );
};
