import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";

export function Logo({ className }: { className?: string }) {
  const { state } = useSidebar();
  return (
    <div className={cn(
        "flex items-center gap-2",
        state === 'collapsed' && 'justify-center',
        className
    )}>
      <Image
        src="/logo.svg"
        alt="SnapShop AI Logo"
        width={24}
        height={24}
        className="h-8 w-8"
      />
      <span className={cn(
        "text-lg font-semibold text-sidebar-foreground",
        state === 'collapsed' && 'hidden'
      )}>
        SnapShop AI
      </span>
    </div>
  );
}
