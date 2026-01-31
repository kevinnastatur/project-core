"use client";

import { ChangeEvent } from "react";

interface GeneralInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  maxLength?: number;
  required?: boolean;
  reddot?: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function EmailInput({
  label,
  name,
  value,
  placeholder,
  type = "email",
  maxLength,
  reddot = false,
  required = false,
  disabled = false,
  onChange,
}: GeneralInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>
        {label} {reddot && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        onChange={onChange}
        disabled={disabled}
        className="bg-input py-3 px-5 rounded-lg font-medium border border-input-border"
      />
    </div>
  );
}
