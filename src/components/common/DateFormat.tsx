import React from "react";

interface DateFormatProps {
  date: string | Date;
  className?: string;
}

const DateFormat: React.FC<DateFormatProps> = ({ date, className }) => {
  if (!date) return null;

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);

  return <span className={className}>{formattedDate}</span>;
};

export default DateFormat;
