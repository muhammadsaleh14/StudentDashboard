import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

interface EditableFieldProps {
  label: string;
  value: string | null;
  onSave: (value: string) => void; // Added onSave prop to handle saving
  validator: z.ZodType<any>;
}

export const EditableField = ({
  label,
  value,
  onSave, // Added onSave to handle saving value
  validator,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string | null>(value);
  const [error, setError] = useState("");

  const handleSave = () => {
    try {
      validator.parse(inputValue); // Validate input with Zod
      if (inputValue == null) {
        throw new Error("Value is required");
      }
      onSave(inputValue); // Call onSave prop to save the value
      setIsEditing(false);
      setError(""); // Clear error on successful save
    } catch (err: any) {
      setError(err.errors[0].message); // Display validation error
    }
  };

  return (
    <div className="m-2">
      <div className="text-lg">{label}:</div>
      {isEditing ? (
        <div>
          <div className="flex justify-around">
            <input
              value={inputValue ?? ""}
              onChange={(e) => setInputValue(e.target.value)}
              className="border rounded p-1"
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
        <div className="flex justify-between">
          <span>{value !== null ? value : "N/A"}</span>
          <Button size={"icon"} onClick={() => setIsEditing(true)}>
            <Pencil1Icon />
          </Button>
        </div>
      )}
    </div>
  );
};
