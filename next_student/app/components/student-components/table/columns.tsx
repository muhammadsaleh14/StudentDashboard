"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/app/interfaces/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This type is used to define the shape of our data.
// You can use  a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const student = row.original; // Access the full row data
      return (
        <Avatar>
          <AvatarImage src={student.image ?? ""} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cnic",
    header: "CNIC",
  },
  {
    accessorKey: "department.name",
    header: "department",
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
  },
];
