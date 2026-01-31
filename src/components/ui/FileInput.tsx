"use client";

import { ChangeEvent, useState } from "react";
import { FaPlus, FaTrash, FaFilePdf, FaFileImage } from "react-icons/fa";

interface FilePdfInputProps {
  label: string;
  description?: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  maxSize?: number; // MB
  onChange: (files: File[]) => void;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export default function FilePdfInput({
  label,
  description,
  name,
  required = false,
  multiple = false,
  maxSize = 10,
  onChange,
}: FilePdfInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);

    const maxSizeBytes = maxSize * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Hanya file PDF atau gambar yang diperbolehkan");
        return false;
      }

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
    <div className="w-full flex flex-col gap-2 text-white">
      {/* INPUT */}
      <input
        id={name}
        name={name}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/jpg,image/heic"
        multiple={multiple}
        required={required && files.length === 0}
        onChange={handleChange}
        className="hidden"
      />

      <p>
        {label} {required && <span className="text-red-500">*</span>}
      </p>

      {/* DROP ZONE */}
      <label
        htmlFor={name}
        className={`bg-input rounded-lg font-medium text-sm xl:text-base border-2 border-dashed w-full flex flex-col gap-2 p-3 items-center justify-center cursor-pointer transition
        ${
          files.length > 0
            ? "border-primary"
            : "border-input-border hover:border-primary"
        }`}
      >
        {files.length > 0 ? (
          <div className="flex flex-col gap-3 w-full">
            {files.map((file, index) => {
              const isPdf = file.type === "application/pdf";
              const previewUrl = !isPdf ? URL.createObjectURL(file) : null;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 gap-3 "
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {isPdf ? (
                      <FaFilePdf className="text-red-500 text-xl" />
                    ) : (
                      <img
                        src={previewUrl!}
                        alt={file.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}

                    <p className="text-sm truncate">{file.name}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="text-red-500 hover:text-red-600 transition p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-primary text-center">
            {description ?? "Unggah file"}
            <FaPlus className="text-xs xl:text-sm" />
          </p>
        )}
      </label>

      {/* ERROR */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
