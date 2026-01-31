"use client";

import Link from "next/link";
import { MdOutlineArrowRight } from "react-icons/md";

interface ActionLinkProps {
  href: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export default function ActionLink({
  href,
  label,
  disabled = false,
  className = "",
}: ActionLinkProps) {
  if (disabled) {
    return (
      <span
        className={`
          bg-primary/50
          px-5 py-3
          text-secondary/60
          rounded-lg
          text-sm xl:text-base
          flex items-center gap-1
          cursor-not-allowed
          select-none
          ${className}
        `}
      >
        <span>{label}</span>
        <MdOutlineArrowRight />
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`
        bg-primary
        px-5 py-3
        text-secondary
        rounded-lg
        text-sm xl:text-base
        flex items-center gap-1
        transition
        hover:opacity-90
        ${className}
      `}
    >
      <span>{label}</span>
      <MdOutlineArrowRight />
    </Link>
  );
}
