/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText } from "lucide-react";
import React from "react";

interface AddModuleFromProps {
  register: any;
  errors: any;
  defaultValue?: string;
}
const AddModuleFrom = ({
  register,
  errors,
  defaultValue = "",
}: AddModuleFromProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Module Information
      </h2>

      <div>
        <label
          htmlFor="moduleTitle"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Module Title *
        </label>
        <input
          id="moduleTitle"
          defaultValue={defaultValue}
          type="text"
          {...register("moduleTitle", {
            required: "Module title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Title must be less than 100 characters",
            },
          })}
          className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="Enter module title"
        />
        {errors.moduleTitle && (
          <p className="mt-1 text-sm text-destructive">
            {errors.moduleTitle.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddModuleFrom;
