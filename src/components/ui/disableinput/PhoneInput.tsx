import { GeneralInputProps } from "@/types/input";
import Skeleton from "@/components/ui/Skeleton";

export default function DisablePhoneInput({ value }: GeneralInputProps) {
  if (!value) {
    return <Skeleton className="h-11 w-full rounded-lg" />;
  }

  return (
    <div className="p-3 w-full flex items-center gap-2 bg-color-input-disabled text-[#a3a3a3] rounded-lg font-medium">
      <span className="px-3 select-none shrink-0">+62</span>
      <p className="truncate">{value}</p>
    </div>
  );
}
