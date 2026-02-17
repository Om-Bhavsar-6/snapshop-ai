import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export const Logo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        <Image
          src="/logo.png"
          alt="SnapShop AI Logo"
          width={24}
          height={24}
          className="h-8 w-8"
        />
        <span className="text-lg font-semibold text-sidebar-foreground">
          SnapShop AI
        </span>
      </div>
    );
  }
);
Logo.displayName = "Logo";
