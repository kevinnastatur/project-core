import DateFormat from "@/components/common/DateFormat";
import Skeleton from "@/components/ui/Skeleton";
import { GeneralInputProps } from "@/types/input";
import { HiCalendarDateRange } from "react-icons/hi2";

export default function DisableDateInput({ value }: GeneralInputProps) {
  if (!value) {
    return <Skeleton className="h-11 w-full rounded-lg" />;
  }

  return (
    <div className="flex items-center justify-between p-3 w-full bg-color-input-disabled text-[#a3a3a3] rounded-lg font-medium">
      <p className="truncate">
        <DateFormat date={value} />
      </p>

      <span className="ml-2 shrink-0">
        <HiCalendarDateRange />
      </span>
    </div>
  );
}
