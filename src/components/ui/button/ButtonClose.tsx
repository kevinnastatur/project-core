import { IoClose } from "react-icons/io5";

export default function ButtonClose({
  className = "cursor-pointer",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button className={className} onClick={onClick}>
      <IoClose />
    </button>
  );
}
