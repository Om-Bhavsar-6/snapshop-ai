import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="SnapShop AI Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="text-lg font-semibold text-foreground">
        SnapShop AI
      </span>
    </div>
  );
}
