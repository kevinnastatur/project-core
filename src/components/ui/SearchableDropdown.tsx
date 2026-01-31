"use client";

import { useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  value: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function SearchableDropdown({
  label,
  value,
  options,
  placeholder = "Pilih option",
  required = false,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold">
      <label>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full bg-input py-3 px-5 rounded-lg border border-input-border flex justify-between items-center"
        >
          <span>{value || placeholder}</span>
          <RiArrowDropDownFill className="text-2xl" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 w-full bg-input border border-input-border rounded-lg mt-1 max-h-80 overflow-hidden">
            <div className="p-3">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-input-fill outline-none"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-400">No result</div>
              )}

              {filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary hover:text-input"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
