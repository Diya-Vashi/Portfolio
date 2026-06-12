import { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-light italic text-foreground tracking-tight">
        {children}
      </h2>
      <div className="w-16 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 mx-auto mt-4 rounded-full" />
    </div>
  );
}