"use client";

import { ChangeEvent } from "react";
import PasswordInput from "./PasswordInput";

interface ConfirmPasswordInputProps {
  value: string;
  confirmValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function ConfirmPasswordInput({
  value,
  confirmValue,
  onChange,
  placeholder,
}: ConfirmPasswordInputProps) {
  const isMismatch = confirmValue.length > 0 && value !== confirmValue;

  return (
    <div className="flex flex-col gap-1">
      <PasswordInput
        label="Konfirmasi Kata Sandi"
        name="confirmPassword"
        placeholder={placeholder}
        value={confirmValue}
        required
        onChange={onChange}
      />

      {isMismatch && (
        <p className="text-red-500 text-xs font-medium">Password tidak sama</p>
      )}
    </div>
  );
}
