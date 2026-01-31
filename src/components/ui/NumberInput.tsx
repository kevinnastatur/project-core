"use client";
import { ChangeEvent } from "react";

interface NumberInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function NumberInput({
  label,
  name,
  value,
  placeholder,
  maxLength = 6,
  required = false,
  onChange,
}: NumberInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    onChange(input);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center bg-input border border-input-border rounded-lg overflow-hidden">
        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={handleChange}
          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
        />
      </div>
    </div>
  );
}
