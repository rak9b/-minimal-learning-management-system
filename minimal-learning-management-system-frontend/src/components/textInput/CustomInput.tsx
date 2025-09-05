/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type CustomInputProps = {
  level: string;
  name: string;
  errors?: any;
  register: any; // Adjust type as per your form library
  placeholder?: string;
  type?: string;
  errorMessage?: string;
};
const CustomInput = ({
  level,
  name,
  errors,
  register,
  placeholder,
  type,
  errorMessage,
}: CustomInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {level}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          {...register(name, {
            required: errorMessage,
          })}
        />
      </div>
      {errors[name] && (
        <p className="text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CustomInput;
