"use client";

import { ChangeEvent } from "react";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  min?: string;
  max?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function DateInput({
  label,
  name,
  value,
  min,
  max,
  required = false,
  onChange,
}: DateInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type="date"
        value={value}
        min={min}
        max={max}
        required={required}
        onChange={handleChange}
        className="
        date-input
          bg-input
          py-3
          px-5
          rounded-lg
          font-medium
          border
          border-input-border
          outline-none
          focus:ring-2
          focus:ring-primary
          text-white
          
        "
      />
    </div>
  );
}
