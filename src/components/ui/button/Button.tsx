interface ButtonProps {
  label: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  label,
  disabled = false,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        bg-primary
        border border-primary
        text-secondary
        font-bold
        py-3 px-5
        rounded-lg
        transition-all
        duration-300
        ease-out
        w-full
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-transparent hover:text-primary"
        }
      `}
    >
      {label}
    </button>
  );
}
