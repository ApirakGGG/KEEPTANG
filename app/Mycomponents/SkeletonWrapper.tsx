import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypeProps {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}

export default function SklWraper({
  children,
  isLoading,
  fullWidth = true 
}: TypeProps) {
  if (!isLoading) {
    return children;
  }
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
