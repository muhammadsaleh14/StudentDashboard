import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { DatePickerForm } from "../ui/DatePickerForm";

interface EditableFieldProps {
  label: string;
  value: Date | null;
  onSave: (value: Date) => void; // Added onSave prop to handle saving
  validator: z.ZodType<any>;
}
export const DateEditableField = ({
  label,
  value,
  onSave,
  validator,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<Date | null | undefined>(null);
  const [error, setError] = useState("");

  const handleSave = () => {
    try {
      validator.parse(inputValue); // Validate input with Zod
      if (inputValue == null || inputValue === undefined) {
        throw new Error("Value is required");
      }
      onSave(inputValue); // Call onSave prop to save the value
      setIsEditing(false);
      setError(""); // Clear error on successful save
    } catch (err: any) {
      throw err;
      // setError(err.errors[0].message); // Display validation error
    }
  };

  return (
    <div className="m-2 ">
      <div className="text-lg">{label}:</div>
      {isEditing ? (
        <div>
          <div className="flex justify-around">
            {/* Use DatePickerForm and handle date selection */}
            <DatePickerForm
              onSelect={(date) => setInputValue(date)}
              initialValue={value}
            />
            <Button size={"sm"} onClick={handleSave}>
              Save
            </Button>
            <Button size={"sm"} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex justify-between ">
          <span>
            {value !== null
              ? typeof value === "string"
                ? value
                : value instanceof Date
                ? value.toLocaleDateString() // Convert Date object to a readable string
                : "Invalid date"
              : "N/A"}
          </span>
          <Button size={"icon"} onClick={() => setIsEditing(true)}>
            <Pencil1Icon />
          </Button>
        </div>
      )}
    </div>
  );
};
