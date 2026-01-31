"use client";

import { ChangeEvent } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";

interface Option {
  label: string;
  value: string;
}

interface DropdownInputProps {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function DropdownInput({
  label,
  name,
  value,
  options,
  placeholder = "Select option",
  required = false,
  disabled = false,
  onChange,
}: DropdownInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </label>

      {/* WRAPPER */}
      <div className="relative w-full">
        <select
          id={name}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={`w-full bg-input py-3 px-5 pr-12 rounded-lg font-medium border border-input-border focus:outline-none focus:ring-2 focus:ring-primary appearance-none
            ${disabled ? " cursor-not-allowed bg-input-fill" : ""}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* ICON */}
        <RiArrowDropDownFill className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl" />
      </div>
    </div>
  );
}
