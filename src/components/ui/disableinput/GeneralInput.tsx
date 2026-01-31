import { GeneralInputProps } from "@/types/input";
import Skeleton from "@/components/ui/Skeleton";

export default function DisableGeneralInput({ value }: GeneralInputProps) {
  if (!value) {
    return <Skeleton className="h-11 w-full rounded-lg" />;
  }

  return (
    <div className="p-3 w-full bg-color-input-disabled text-[#a3a3a3] rounded-lg truncate font-medium">
      <p>{value}</p>
    </div>
  );
}
