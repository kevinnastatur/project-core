"use client";

import { ChangeEvent, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface FileInputProps {
  label: string;
  description?: string;
  name: string;
  editlabel?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  preview?: string | null;
  onChange: (files: File[]) => void;
}

export default function FileImageInput({
  label,
  description,
  name,
  editlabel,
  required = false,
  multiple = false,
  accept = ".png,.jpg,.jpeg,.heic",
  maxSize = 10,
  preview = null,
  onChange,
}: FileInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);

    const maxSizeBytes = maxSize * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSizeBytes) {
        setError(`Ukuran file maksimal ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;

    setFiles(newFiles);
    onChange(newFiles);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 ">
      {/* INPUT */}
      <input
        id={name}
        name={name}
        type="file"
        multiple={multiple}
        accept={accept}
        required={required && files.length === 0}
        onChange={handleChange}
        className="hidden"
      />

      {/* DROP ZONE */}
      <label
        htmlFor={name}
        className={`bg-input p-5 rounded-lg font-medium text-sm xl:text-base border-2 border-dashed w-full flex flex-col gap-3 items-center justify-center min-h-32 h-full cursor-pointer transition
  ${
    files.length > 0 || preview
      ? "border-primary"
      : "border-input-border hover:border-primary"
  }`}
      >
        {files.length > 0 ? (
          /* ================= FILE BARU ================= */
          <div className="flex flex-wrap gap-4 justify-center w-full">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center gap-2"
              >
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 min-w-24 object-cover rounded-lg"
                  />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                >
                  <FaTrash />
                </button>

                <p className="text-xs text-white max-w-50 truncate text-center">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        ) : preview ? (
          /* ================= PREVIEW DARI API ================= */
          <div className="relative flex flex-col items-center gap-2">
            <img
              src={preview}
              alt="Preview"
              className="h-24 min-w-24 object-cover rounded-lg"
            />

            <p className="text-xs text-white/70 text-center">
              Klik untuk mengganti gambar {editlabel}
            </p>
          </div>
        ) : (
          /* ================= EMPTY ================= */
          <>
            <p className="flex items-center gap-2 text-primary text-center">
              {label}
              <FaPlus className="text-xs xl:text-sm" />
            </p>

            {description && (
              <p className="text-xs xl:text-sm text-white/80 text-center">
                {description}{" "}
                {required && <i className="text-red-500">(Required)</i>}
              </p>
            )}
          </>
        )}
      </label>

      {/* ERROR */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
