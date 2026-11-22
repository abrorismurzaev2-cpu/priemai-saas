import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { icon: "h-5 w-5", text: "text-base" },
  md: { icon: "h-6 w-6", text: "text-lg" },
  lg: { icon: "h-7 w-7", text: "text-xl" },
};

/** «Приём» + красный «AI» */
export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  showIcon = true,
  size = "md",
}: BrandLogoProps) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showIcon && (
        <Bot className={cn(s.icon, "text-primary shrink-0", iconClassName)} />
      )}
      <span className={cn("font-bold tracking-tight", s.text, textClassName)}>
        Приём
        <span className="text-red-500">AI</span>
      </span>
    </span>
  );
}
