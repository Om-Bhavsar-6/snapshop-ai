import { cn } from "@/lib/utils";
import Image from "next/image";

export function HeaderLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.svg"
        alt="SnapShop AI Logo"
        width={24}
        height={24}
        className="h-8 w-8"
      />
    </div>
  );
}
