import { GeneralInputProps } from "@/types/input";
import Skeleton from "@/components/ui/Skeleton";

export default function DisableOdometerInput({ value }: GeneralInputProps) {
  if (!value) {
    return <Skeleton className="h-11 w-full rounded-lg" />;
  }

  return (
    <div className="p-3 w-full flex items-center justify-between bg-color-input-disabled text-[#a3a3a3] rounded-lg truncate font-medium">
      <p className="truncate">{value}</p>
      <span className="px-3 select-none shrink-0">km</span>
    </div>
  );
}
