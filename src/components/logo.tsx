import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.svg"
        alt="SnapShop AI Logo"
        width={24}
        height={24}
        className="h-6 w-6"
      />
      <span className="text-lg font-semibold text-foreground">
        SnapShop AI
      </span>
    </div>
  );
}
