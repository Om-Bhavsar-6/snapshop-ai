import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-auto", className)}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SnapShop AI Logo"
    >
      <path
        d="M17.46 13.48H22.02L14.76 26.52H10.2L17.46 13.48Z"
        className="fill-primary"
      />
      <path
        d="M6.17999 13.48H1.61999L8.87999 26.52H13.44L6.17999 13.48Z"
        className="fill-primary opacity-70"
      />
      <text
        x="32"
        y="27"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="600"
        className="fill-foreground"
      >
        SnapShop AI
      </text>
    </svg>
  );
}
