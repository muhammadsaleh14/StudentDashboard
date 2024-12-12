"use client";
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

interface Department {
  id: number;
  name: string;
}

interface DepartmentComboboxProps {
  setDepartment: (department: Department) => void; // Function to return selected department to the parent form
  availableDepartments: Department[]; // List of available departments
}

export const DepartmentCombobox = ({
  setDepartment,
  availableDepartments,
}: DepartmentComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department); // Update selected department
    setDepartment(department); // Pass selected department to parent form
    setOpen(false); // Close the popover
  };

  return (
    <div>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedDepartment
              ? selectedDepartment.name
              : "Select a department..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search department..." className="h-9" />
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {availableDepartments.map((department) => (
                  <CommandItem
                    key={department.id}
                    onSelect={() => handleSelectDepartment(department)}
                  >
                    {department.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
