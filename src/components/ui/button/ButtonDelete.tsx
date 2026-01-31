import { MdOutlineArrowRight } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function ButtonDelete({
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
        bg-[#DF3400]
        border border-[#DF3400]
        text-white
        font-bold
        py-3 px-5
        rounded-lg
        transition-all
        duration-300
        ease-out
        w-full
        flex items-center justify-center gap-2
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-transparent hover:text-white"
        }
      `}
    >
      {label}
      <RiDeleteBin6Line />
    </button>
  );
}
