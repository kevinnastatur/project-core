"use client";

import { ChangeEvent } from "react";

interface PhoneInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  reddot?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function PhoneInput({
  label,
  name,
  value,
  placeholder = "8123456789",
  maxLength = 13,
  required = false,
  reddot = false,
  disabled = false,
  onChange,
}: PhoneInputProps) {
  const PREFIX = "+62";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");

    if (input.startsWith("62")) {
      input = input.slice(2);
    }

    if (input.startsWith("0")) {
      input = input.slice(1);
    }

    input = input.slice(0, maxLength);

    onChange(`${PREFIX}${input}`);
  };

  const displayValue = value.replace(PREFIX, "");

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>
        {label} {reddot && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center bg-input border border-input-border rounded-lg overflow-hidden">
        <span className="px-3  font-medium select-none">+62</span>

        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={handleChange}
          disabled={disabled}
          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
        />
      </div>
    </div>
  );
}
