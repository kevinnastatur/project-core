"use client";

import Link from "next/link";
import { MdOutlineArrowLeft } from "react-icons/md";

interface ActionLinkProps {
  href: string;
  label: string;

  className?: string;
}

export default function ActionLinkPrev({
  href,
  label,

  className = "",
}: ActionLinkProps) {
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
      <MdOutlineArrowLeft />
      <span>{label}</span>
    </Link>
  );
}
