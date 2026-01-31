"use client";

import Link from "next/link";
import { MdOutlineArrowLeft } from "react-icons/md";

interface ActionLinkProps {
  href: string;
  label: string;

  className?: string;
}

export default function ActionLinkPrevGrey({
  href,
  label,

  className = "",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`
        bg-[#333333]
        px-5 py-3
        text-primary
        rounded-lg
        text-sm xl:text-base
        flex items-center gap-1
        transition
        hover:opacity-90
        font-bold
        justify-center
        ${className}
      `}
    >
      <MdOutlineArrowLeft />
      <span>{label}</span>
    </Link>
  );
}
