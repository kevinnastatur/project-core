"use client";

import { useEffect, useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function SearchableDropdown({
  label,
  value,
  options,
  placeholder = "Pilih option",
  required = false,
  disabled = false,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setSearch("");
    }
  }, [disabled]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-white font-bold">
      <label>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`w-full bg-input py-3 px-5 rounded-lg border border-input-border flex justify-between items-center
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span className={!value ? "text-input-placeholder" : ""}>
            {value || placeholder}
          </span>
          <RiArrowDropDownFill className="text-2xl" />
        </button>

        {/* Dropdown */}
        {open && !disabled && (
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
