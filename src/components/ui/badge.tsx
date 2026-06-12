import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-all duration-300";

  const variants = {
    default: "bg-[#1e1e2e] text-[#e8e8f0] border border-[#1e1e2e]",
    gold: "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]",
    outline: "bg-transparent text-[#6b6b80] border border-[#1e1e2e]",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}