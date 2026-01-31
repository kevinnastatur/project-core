import { MdOutlineArrowRight } from "react-icons/md";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function ButtonSubmit({
  label,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
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
        flex items-center justify-center
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-transparent hover:text-primary"
        }
      `}
    >
      {label} <MdOutlineArrowRight />
    </button>
  );
}
