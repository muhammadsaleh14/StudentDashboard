"use client"; // Required for client-side state management

import React, { createContext, useContext, useState } from "react";
import { Student } from "../interfaces/models";
import { useStudents } from "./students-list-provider";

// Define the context and the types for the state and updater function
interface SelectedRowContextType {
  selectedRow: Student | null;
  setSelectedRow: React.Dispatch<React.SetStateAction<Student | null>>;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCardOpen: boolean;
}

// Create the context
const SelectedRowContext = createContext<SelectedRowContextType | undefined>(
  undefined
);

// Create a context provider component
export const SelectedRowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  const { updateStudent } = useStudents(); // Hook to use the other context

  const handleSetSelectedRow: React.Dispatch<
    React.SetStateAction<Student | null>
  > = (newRow) => {
    // If newRow is a function (which is allowed by the dispatch type), call it
    const newRowValue =
      typeof newRow === "function" ? newRow(selectedRow) : newRow;

    // Check if selectedRow and newRow are not null and compare their IDs
    if (selectedRow && newRowValue && selectedRow.id === newRowValue.id) {
      // Call the method from another context to update its state
      console.log("Updated student..." + newRowValue);
      updateStudent(newRowValue); // Adjust this line to fit your context's API
    } else {
    }

    setIsCardOpen(true);
    // Set the new selected row
    setSelectedRow(newRowValue);
  };

  return (
    <SelectedRowContext.Provider
      value={{
        selectedRow,
        setSelectedRow: handleSetSelectedRow,
        isCardOpen,
        setIsCardOpen,
      }}
    >
      {children}
    </SelectedRowContext.Provider>
  );
};

// Custom hook to use the context in other components
export const useSelectedRow = () => {
  const context = useContext(SelectedRowContext);
  if (!context) {
    throw new Error("useSelectedRow must be used within a SelectedRowProvider");
  }
  return context;
};
