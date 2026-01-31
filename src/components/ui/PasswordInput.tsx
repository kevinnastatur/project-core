"use client";

import { getPasswordStrength, passwordRules } from "@/helper/PasswordHelper";
import { ChangeEvent, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  showStrength?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  label,
  name,
  value,
  placeholder,
  maxLength = 64,
  required = false,
  onChange,
  showStrength = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const strength = getPasswordStrength(value);

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
      <label htmlFor={name}>{label}</label>

      {/* INPUT */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={onChange}
          className="bg-input py-3 px-5 pr-12 rounded-lg font-medium border border-input-border w-full"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {visible ? <MdOutlineRemoveRedEye /> : <FaEyeSlash />}
        </button>
      </div>

      {showStrength && value && (
        <ul className="mt-2 space-y-1 text-xs font-medium">
          <li
            className={
              passwordRules.length(value) ? "text-green-400" : "text-gray-400"
            }
          >
            • Minimal 8 karakter
          </li>
          <li
            className={
              passwordRules.uppercase(value)
                ? "text-green-400"
                : "text-gray-400"
            }
          >
            • Mengandung huruf besar (A-Z)
          </li>
          <li
            className={
              passwordRules.lowercase(value)
                ? "text-green-400"
                : "text-gray-400"
            }
          >
            • Mengandung huruf kecil (a-z)
          </li>
          <li
            className={
              passwordRules.number(value) ? "text-green-400" : "text-gray-400"
            }
          >
            • Mengandung angka (0-9)
          </li>
          <li
            className={
              passwordRules.symbol(value) ? "text-green-400" : "text-gray-400"
            }
          >
            • Mengandung simbol (!@#$%)
          </li>
        </ul>
      )}
    </div>
  );
}
